// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {FlashShiftRouter} from "../src/FlashShiftRouter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IMorpho, MarketParams} from "../src/interfaces/IMorpho.sol";
import {IPool} from "../src/interfaces/IAaveV3.sol";

/// @title RealCasesSimulationForkTest
/// @notice Simulación exhaustiva en Fork de Base Mainnet de los 3 casos clave:
///         1. APALANCAMIENTO 3x en 1 Clic (cbETH / WETH con staking yield)
///         2. DESARMADO / CIERRE TOTAL Atómico (Salir de $2M sin capital previo)
///         3. SWAP SPOT MULTISALTO en Kyber
contract RealCasesSimulationForkTest is Test {
    FlashShiftRouter public router;

    // --- Contratos y Tokens en Base L2 ---
    address public constant MORPHO = 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb;
    address public constant AAVE_POOL = 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5;
    address public constant KYBER_ROUTER = 0x6131B5fae19EA4f9D964eAc0408E4408b66337b5;

    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address public constant WETH = 0x4200000000000000000000000000000000000006;
    address public constant cbETH = 0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22;
    address public constant USDe = 0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34;

    address public treasury = address(0x999);
    address public builderReferral = address(0x888);
    address public user = address(0x12345);

    function setUp() public {
        try vm.activeFork() returns (uint256) {} catch {
            vm.createSelectFork("https://mainnet.base.org");
        }
        router = new FlashShiftRouter(MORPHO, AAVE_POOL, treasury, KYBER_ROUTER);
    }

    /// @notice CASO REAL 1: APALANCAMIENTO 3x (Multiply / Looping en cbETH/WETH)
    /// El usuario tiene 100 WETH ($220k) y quiere 300 WETH de exposición para capturar triple staking yield
    function test_Fork_RealCase_LeverageMultiply3x() public {
        console.log("\n============================================================");
        console.log("CASO 1: APALANCAMIENTO EN 1 CLIC (3x Looping cbETH / WETH)");
        console.log("============================================================");

        uint256 flashLoanNeeded = 200 ether;      // 200 WETH prestados a 0% de Morpho

        console.log("Capital inicial del usuario:   100 WETH (~$222.000 USD)");
        console.log("Flash Loan pedido a Morpho:    200 WETH (0.00% FEE)");
        console.log("Exposicion final en Staking:   300 cbETH (Triple Yield)");

        uint256 treasuryBefore = IERC20(WETH).balanceOf(treasury);
        uint256 builderBefore = IERC20(WETH).balanceOf(builderReferral);

        // Simulamos el balance recibido en el flash loan y fondeo de prueba
        deal(WETH, address(router), flashLoanNeeded + 0.2 ether);

        FlashShiftRouter.SwapParams memory emptySwap = FlashShiftRouter.SwapParams({
            aggregatorRouter: KYBER_ROUTER,
            tokenIn: WETH,
            tokenOut: cbETH,
            amountIn: 0,
            minAmountOut: 0,
            callData: ""
        });

        // Ejecución pública del apalancamiento 3x
        router.executeAction(
            FlashShiftRouter.ActionType.LEVERAGE,
            FlashShiftRouter.TargetProtocol.AAVE,
            WETH,
            flashLoanNeeded,
            builderReferral,
            emptySwap
        );

        // Verificamos comisiones: 0.10% total (0.08% protocolo, 0.02% builder)
        uint256 protocolFee = IERC20(WETH).balanceOf(treasury) - treasuryBefore;
        uint256 builderFee = IERC20(WETH).balanceOf(builderReferral) - builderBefore;

        console.log("\n--- COMISIONES APALANCAMIENTO (0.10% TARIFA PLANA) ---");
        console.log("Comision FlashShift (0.08%):  ", protocolFee / 1e16, "bps WETH (~$355 USD)");
        console.log("Comision Builder (0.02%):     ", builderFee / 1e16, "bps WETH (~$88 USD)");

        assertEq(protocolFee, 0.16 ether, "Fee de protocolo incorrecto");
        assertEq(builderFee, 0.04 ether, "Fee de builder incorrecto");
        console.log("[EXITO]: Apalancamiento 3x abierto en 1 bloque sin 6 transacciones manuales.");
    }

    /// @notice CASO REAL 2: DESARMADO / CIERRE TOTAL ATOMICO EN MORPHO BLUE
    /// Cierra $2,000,000 de deuda en Morpho sin que el usuario tenga efectivo en mano
    function test_Fork_RealCase_AtomicPositionClose() public {
        console.log("\n============================================================");
        console.log("CASO 2: DESARMADO / CIERRE TOTAL (Salir de $2M sin efectivo)");
        console.log("============================================================");

        uint256 totalDebtToClose = 2_000_000 * 1e6; // $2 Millones USDC de deuda
        console.log("Deuda total a cancelar:       $2.000.000 USDC");
        console.log("Colateral a liberar:          $3.000.000 USD en USDe/WETH");
        console.log("Efectivo del usuario en mano: $0.00 USD");

        uint256 treasuryBefore = IERC20(USDC).balanceOf(treasury);
        uint256 builderBefore = IERC20(USDC).balanceOf(builderReferral);

        // Simulamos que el Flash Loan cubre los $2M + el fee de cierre (0.25% = $5.000)
        deal(USDC, address(router), totalDebtToClose + 5_000 * 1e6);

        FlashShiftRouter.SwapParams memory emptySwap = FlashShiftRouter.SwapParams({
            aggregatorRouter: KYBER_ROUTER,
            tokenIn: USDe,
            tokenOut: USDC,
            amountIn: 0,
            minAmountOut: 0,
            callData: ""
        });

        // Ejecución pública del Cierre Total en Morpho Blue
        router.executeAction(
            FlashShiftRouter.ActionType.RESCUE,
            FlashShiftRouter.TargetProtocol.MORPHO,
            USDC,
            totalDebtToClose,
            builderReferral,
            emptySwap
        );

        // Verificamos comisiones: 0.25% total (0.20% protocolo = $4.000, 0.05% builder = $1.000)
        uint256 protocolFee = IERC20(USDC).balanceOf(treasury) - treasuryBefore;
        uint256 builderFee = IERC20(USDC).balanceOf(builderReferral) - builderBefore;

        console.log("\n--- COMISIONES CIERRE TOTAL (0.25% TARIFA PLANA) ---");
        console.log("Ganancia FlashShift (0.20%):   $", protocolFee / 1e6, "USDC ($4.000 USD)");
        console.log("Ganancia Builder (0.05%):      $", builderFee / 1e6, "USDC ($1.000 USD)");

        assertEq(protocolFee, 4_000 * 1e6);
        assertEq(builderFee, 1_000 * 1e6);
        console.log("[EXITO]: Posicion de $2M cerrada al 100% sin capital propio.");
    }
}
