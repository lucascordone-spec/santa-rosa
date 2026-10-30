const fetch = globalThis.fetch || require("node-fetch");
const fs = require("fs");
const path = require("path");

const WETH = "0x4200000000000000000000000000000000000006";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

async function generatePMMTest() {
  console.log("Obteniendo calldata de PMMs (Bebop / PMM-19 / WOOFi) para $1,000,000 USD...");
  const rawWeth = (450n * 10n ** 18n).toString(); // ~450 WETH = $1M USD
  const testAddress = "0x0000000000000000000000000000000000000123";

  const routeUrl = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${WETH}&tokenOut=${USDC}&amountIn=${rawWeth}&saveGas=0`;
  const routeRes = await fetch(routeUrl, { headers: { "x-client-id": "flashshift" } });
  const routeData = await routeRes.json();
  const summary = routeData.data?.routeSummary;

  const buildUrl = `https://aggregator-api.kyberswap.com/base/api/v1/route/build`;
  const buildRes = await fetch(buildUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-client-id": "flashshift" },
    body: JSON.stringify({
      routeSummary: summary,
      sender: testAddress,
      recipient: testAddress,
      slippageTolerance: 100 // 1%
    })
  });
  const buildData = await buildRes.json();
  const callData = buildData.data?.data;

  const testSolidity = `// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PMMOnChainVerificationTest is Test {
    address constant WETH = 0x4200000000000000000000000000000000000006;
    address constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address constant KYBER_ROUTER = 0x6131B5fae19EA4f9D964eAc0408E4408b66337b5;

    function setUp() public {
        try vm.activeFork() returns (uint256) {} catch {
            vm.createSelectFork("https://mainnet.base.org");
        }
        vm.warp(${summary.timestamp});
    }

    /// @notice Prueba On-Chain: Ejecución real de $1.000.000 USD absorbido por PMMs
    function test_OnChain_Execute_1M_PMM_Swap() public {
        address user = address(0x123);
        uint256 amountIn = ${rawWeth};
        bytes memory cd = hex"${callData.replace("0x", "")}";

        deal(WETH, user, amountIn);

        vm.startPrank(user);
        IERC20(WETH).approve(KYBER_ROUTER, amountIn);

        uint256 usdcBefore = IERC20(USDC).balanceOf(user);
        (bool success, ) = KYBER_ROUTER.call(cd);
        require(success, "PMM execution failed");
        uint256 usdcAfter = IERC20(USDC).balanceOf(user);
        vm.stopPrank();

        uint256 received = usdcAfter - usdcBefore;
        console.log("=== VERIFICACION ON-CHAIN: 1 MILLON USD EN PMMs ===");
        console.log("WETH entregado:", amountIn / 1e18);
        console.log("USDC real recibido en wallet:", received / 1e6);

        // Verificamos que se reciban al menos $985.000 USDC (slippage < 1.5% para $1M)
        assertGt(received, 985000 * 1e6, "Slippage excesivo en PMM");
    }
}
`;

  const outputPath = path.join(__dirname, "contracts", "test", "PMMOnChainVerificationTest.t.sol");
  fs.writeFileSync(outputPath, testSolidity);
  console.log("Test PMM generado en:", outputPath);
}

generatePMMTest();
