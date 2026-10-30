// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {FlashShiftRouter} from "../src/FlashShiftRouter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IMorpho, MarketParams} from "../src/interfaces/IMorpho.sol";
import {IPool} from "../src/interfaces/IAaveV3.sol";

contract RealWhaleRescueForkTest is Test {
    FlashShiftRouter public router;

    address public constant MORPHO = 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb;
    address public constant AAVE_POOL = 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5;
    address public constant KYBER_ROUTER = 0x6131B5fae19EA4f9D964eAc0408E4408b66337b5;
    
    address public constant WHALE_1 = 0x7bee8D37FBA61a6251a08b957d502C56E2A50FAb;

    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address public constant USDe = 0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34;

    address public treasury = address(0x999);
    address public builderReferral = address(0x888);

    function setUp() public {
        try vm.activeFork() returns (uint256) {} catch {
            vm.createSelectFork("https://mainnet.base.org");
        }

        router = new FlashShiftRouter(MORPHO, AAVE_POOL, treasury, KYBER_ROUTER);
    }

    function test_Fork_RealWhaleRescueSimulation() public {
        console.log("=== SIMULACION FORK: RESCATE CON ENRUTADOR KYBER ===");
        
        uint256 rescueAmount = 5_000_000 * 1e6; // $5M Flash Loan

        uint256 treasuryBefore = IERC20(USDC).balanceOf(treasury);
        uint256 builderBefore = IERC20(USDC).balanceOf(builderReferral);

        // La ballena autoriza al router en Morpho
        vm.prank(WHALE_1);
        IMorpho(MORPHO).setAuthorization(address(router), true);

        // Simulamos la liquidez disponible tras el swap
        deal(USDC, address(router), rescueAmount + 12_500 * 1e6);

        // Configuramos los parámetros del Swap multisalto delegando en Kyber
        FlashShiftRouter.SwapParams memory swapParams = FlashShiftRouter.SwapParams({
            aggregatorRouter: KYBER_ROUTER,
            tokenIn: USDe,
            tokenOut: USDC,
            amountIn: 0, // En este test unitario el balance ya está fondeado
            minAmountOut: 0,
            callData: ""
        });

        // Ejecución pública del rescate
        router.executeAction(
            FlashShiftRouter.ActionType.RESCUE,
            FlashShiftRouter.TargetProtocol.MORPHO,
            USDC,
            rescueAmount,
            builderReferral,
            swapParams
        );

        uint256 treasuryAfter = IERC20(USDC).balanceOf(treasury);
        uint256 builderAfter = IERC20(USDC).balanceOf(builderReferral);

        uint256 protocolEarned = treasuryAfter - treasuryBefore;
        uint256 builderEarned = builderAfter - builderBefore;

        console.log("Ganancia FlashShift (0.20%):", protocolEarned / 1e6, "USDC ($10.000 USD)");
        console.log("Ganancia Builder Referido (0.05%):", builderEarned / 1e6, "USDC ($2.500 USD)");

        assertEq(protocolEarned, 10_000 * 1e6);
        assertEq(builderEarned, 2_500 * 1e6);
    }
}
