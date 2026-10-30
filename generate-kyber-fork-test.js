const fetch = globalThis.fetch || require("node-fetch");
const fs = require("fs");
const path = require("path");

const USDe = "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const ROUTER = "0x6131B5fae19EA4f9D964eAc0408E4408b66337b5";

async function getCalldata(amountUsd, recipient) {
  const rawAmountIn = (BigInt(amountUsd) * 10n ** 18n).toString();
  const routeUrl = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${USDe}&tokenOut=${USDC}&amountIn=${rawAmountIn}`;
  const routeRes = await fetch(routeUrl, { headers: { "x-client-id": "flashshift" } });
  const routeData = await routeRes.json();
  const routeSummary = routeData.data?.routeSummary;

  const buildUrl = `https://aggregator-api.kyberswap.com/base/api/v1/route/build`;
  const buildRes = await fetch(buildUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-client-id": "flashshift" },
    body: JSON.stringify({
      routeSummary: routeSummary,
      sender: recipient,
      recipient: recipient,
      slippageTolerance: 100 // 1%
    })
  });

  const buildData = await buildRes.json();
  return {
    rawIn: rawAmountIn,
    expectedOutRaw: routeSummary.amountOut,
    callData: buildData.data?.data,
    timestamp: routeSummary.timestamp
  };
}

async function main() {
  console.log("Generando test de Fork real en Foundry con calldata de Kyber...");
  
  const testAddress = "0x0000000000000000000000000000000000000123";
  
  const swap100k = await getCalldata(100000, testAddress);

  const testSolidity = `// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract KyberSlippageOnChainTest is Test {
    using SafeERC20 for IERC20;

    address constant USDe = 0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34;
    address constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address constant KYBER_ROUTER = 0x6131B5fae19EA4f9D964eAc0408E4408b66337b5;

    function setUp() public {
        try vm.activeFork() returns (uint256) {} catch {
            vm.createSelectFork("https://mainnet.base.org");
        }
        // Ajustamos block.timestamp al momento exacto en que Kyber firmo la calldata
        vm.warp(${swap100k.timestamp});
    }

    /// @notice Test on-chain: Ejecución real de 1 swap de $100k USDe en Kyber
    function test_OnChain_Kyber_Swap_100k() public {
        address user = address(0x123);
        uint256 amountIn = ${swap100k.rawIn};
        bytes memory cd = hex"${swap100k.callData.replace("0x", "")}";

        // Fondeamos al usuario con deal() de Foundry
        deal(USDe, user, amountIn);

        vm.startPrank(user);
        IERC20(USDe).approve(KYBER_ROUTER, amountIn);

        uint256 usdcBefore = IERC20(USDC).balanceOf(user);
        (bool success, ) = KYBER_ROUTER.call(cd);
        require(success, "Kyber swap 100k failed");
        uint256 usdcAfter = IERC20(USDC).balanceOf(user);
        vm.stopPrank();

        uint256 received = usdcAfter - usdcBefore;
        console.log("=== RESULTADO ON-CHAIN FORK BASE ===");
        console.log("Swap $100k USDe ejecutado");
        console.log("USDC recibido en wallet (6 decimals):", received);
        console.log("USD real recibido:", received / 1e6);
        
        // Verificamos que se reciban al menos 98k USDC (slippage < 2%)
        assertGt(received, 98000 * 1e6, "Slippage excesivo en $100k");
    }

    /// @notice Test on-chain: 6 swaps consecutivos de $100k en el MISMO BLOQUE ($600k total)
    /// Encuentra exactamente el límite de saturación de la piscina
    function test_OnChain_Kyber_Find_Saturation_Limit() public {
        address user = address(0x123);
        uint256 amountIn = ${swap100k.rawIn};
        bytes memory cd = hex"${swap100k.callData.replace("0x", "")}";

        // Fondeamos para 6 swaps ($600k)
        deal(USDe, user, amountIn * 6);

        vm.startPrank(user);
        IERC20(USDe).approve(KYBER_ROUTER, amountIn * 6);

        uint256 totalRec = 0;
        uint256 balPrev = IERC20(USDC).balanceOf(user);

        for (uint256 i = 0; i < 6; i++) {
            (bool success, ) = KYBER_ROUTER.call(cd);
            if (!success) {
                console.log("Swap #%s FALLO! La piscina se saturo.", i + 1);
                break;
            }
            uint256 balNow = IERC20(USDC).balanceOf(user);
            uint256 received = balNow - balPrev;
            balPrev = balNow;
            totalRec += received;
            console.log("Swap #%s USDC recibido: %s (Slippage de este tramo: %s USD)", i + 1, received / 1e6, (amountIn / 1e18) - (received / 1e6));
        }
        vm.stopPrank();

        console.log("Total acumulado recibido:", totalRec / 1e6);
    }
}
`;

  const outputPath = path.join(__dirname, "contracts", "test", "KyberSlippageOnChainTest.t.sol");
  fs.writeFileSync(outputPath, testSolidity);
  console.log("Test generado con éxito en:", outputPath);
}

main();
