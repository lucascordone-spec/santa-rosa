// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IMorpho, MarketParams, IMorphoFlashLoanCallback} from "./interfaces/IMorpho.sol";
import {IPool} from "./interfaces/IAaveV3.sol";

/// @title FlashShiftRouter
/// @notice Router no custodial para RESCATE y APALANCAMIENTO en Base L2.
/// @dev Flash Loan 0.00% en Morpho Blue. Swaps multiruta vía agregador (Kyber/Odos Meta-Router).
contract FlashShiftRouter is IMorphoFlashLoanCallback {
    using SafeERC20 for IERC20;

    enum ActionType { RESCUE, LEVERAGE }
    enum TargetProtocol { MORPHO, AAVE }

    // --- Protocolos Inmutables en Base L2 ---
    IMorpho public immutable morpho;
    IPool public immutable aavePool;
    address public immutable protocolTreasury;

    // --- Tarifas Oficiales FlashShift ---
    uint256 public constant BPS_DENOMINATOR = 10000;
    
    // RESCATE: 0.25% Total (0.20% FlashShift, 0.05% Referido Builder)
    uint256 public constant RESCUE_TOTAL_FEE_BPS = 25;
    uint256 public constant RESCUE_PROTOCOL_BPS = 20;
    uint256 public constant RESCUE_BUILDER_BPS = 5;

    // APALANCAMIENTO: 0.10% Total (0.08% FlashShift, 0.02% Referido Builder)
    uint256 public constant LEVERAGE_TOTAL_FEE_BPS = 10;
    uint256 public constant LEVERAGE_PROTOCOL_BPS = 8;
    uint256 public constant LEVERAGE_BUILDER_BPS = 2;

    // --- Lista Blanca de Agregadores (Kyber Meta-Aggregation Router / Odos) ---
    mapping(address => bool) public isApprovedAggregator;

    // --- Errores ---
    error UnauthorizedCallback();
    error ReentrancyActive();
    error AggregatorNotApproved();
    error SwapExecutionFailed();
    error SlippageExceeded(uint256 received, uint256 minExpected);

    struct SwapParams {
        address aggregatorRouter; // Kyber Meta-Router (ej: 0x6131B5fae19EA4f9D964eAc0408E4408b66337b5)
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 minAmountOut;
        bytes callData;           // Calldata del multisalto calculada off-chain
    }

    struct ExecutionContext {
        ActionType action;
        TargetProtocol protocol;
        address initiator;
        address referral;
        address loanToken;
        uint256 loanAmount;
        SwapParams swap;
    }

    bool private _locked;
    ExecutionContext private _currentContext;

    // --- Eventos ---
    event RescueExecuted(address indexed user, TargetProtocol indexed protocol, uint256 debtRepaid, address referral);
    event LeverageExecuted(address indexed user, TargetProtocol indexed protocol, uint256 collateralAdded, address referral);
    event FeeDistributed(address indexed token, uint256 protocolFee, uint256 builderFee, address indexed referral);

    constructor(address _morpho, address _aavePool, address _treasury, address _kyberRouter) {
        require(_morpho != address(0) && _treasury != address(0), "Zero address");
        morpho = IMorpho(_morpho);
        aavePool = IPool(_aavePool);
        protocolTreasury = _treasury;

        if (_kyberRouter != address(0)) {
            isApprovedAggregator[_kyberRouter] = true;
        }
    }

    modifier nonReentrant() {
        if (_locked) revert ReentrancyActive();
        _locked = true;
        _;
        _locked = false;
    }

    /// @notice Callback ejecutado estrictamente por Morpho Blue
    function onMorphoFlashLoan(uint256 assets, bytes calldata /* data */) external override {
        if (msg.sender != address(morpho)) revert UnauthorizedCallback();
        if (!_locked) revert UnauthorizedCallback();

        ExecutionContext memory ctx = _currentContext;

        if (ctx.action == ActionType.RESCUE) {
            _executeRescue(assets, ctx);
            _distributeFees(ctx.loanToken, assets, RESCUE_TOTAL_FEE_BPS, RESCUE_BUILDER_BPS, ctx.referral);
        } else if (ctx.action == ActionType.LEVERAGE) {
            _executeLeverage(assets, ctx);
            _distributeFees(ctx.loanToken, assets, LEVERAGE_TOTAL_FEE_BPS, LEVERAGE_BUILDER_BPS, ctx.referral);
        }

        // Repago a Morpho Blue (0% fee)
        IERC20(ctx.loanToken).forceApprove(address(morpho), assets);
    }

    /// @dev Ejecuta el swap multiruta delegando en el enrutador del agregador
    function _executeMultihopSwap(SwapParams memory swap) internal returns (uint256 amountOutReceived) {
        if (!isApprovedAggregator[swap.aggregatorRouter]) revert AggregatorNotApproved();

        // 1. Aprobamos al router de Kyber para jalar el token de entrada
        IERC20(swap.tokenIn).forceApprove(swap.aggregatorRouter, swap.amountIn);

        uint256 balanceBefore = IERC20(swap.tokenOut).balanceOf(address(this));

        // 2. Ejecución dinámica de la ruta multicamino (Aerodrome + Uniswap + Curve en 1 llamada)
        (bool success, ) = swap.aggregatorRouter.call(swap.callData);
        if (!success) revert SwapExecutionFailed();

        uint256 balanceAfter = IERC20(swap.tokenOut).balanceOf(address(this));
        amountOutReceived = balanceAfter - balanceBefore;

        // 3. Verificación de slippage estricto
        if (amountOutReceived < swap.minAmountOut) {
            revert SlippageExceeded(amountOutReceived, swap.minAmountOut);
        }
    }

    function _executeRescue(uint256 borrowedAssets, ExecutionContext memory ctx) internal {
        // 1. Repagar deuda en protocolo destino
        if (ctx.protocol == TargetProtocol.AAVE) {
            IERC20(ctx.loanToken).forceApprove(address(aavePool), borrowedAssets);
            aavePool.repay(ctx.loanToken, borrowedAssets, 2, ctx.initiator);
        }

        // 2. Ejecutar swap de colateral liberado vía Kyber Meta-Router
        if (ctx.swap.aggregatorRouter != address(0) && ctx.swap.amountIn > 0) {
            _executeMultihopSwap(ctx.swap);
        }

        emit RescueExecuted(ctx.initiator, ctx.protocol, borrowedAssets, ctx.referral);
    }

    function _executeLeverage(uint256 flashBorrowedAssets, ExecutionContext memory ctx) internal {
        // En apalancamiento: el swap multiruta compra colateral antes de depositar
        if (ctx.swap.aggregatorRouter != address(0) && ctx.swap.amountIn > 0) {
            _executeMultihopSwap(ctx.swap);
        }

        emit LeverageExecuted(ctx.initiator, ctx.protocol, flashBorrowedAssets, ctx.referral);
    }

    function _distributeFees(
        address token,
        uint256 amount,
        uint256 totalFeeBps,
        uint256 builderFeeBps,
        address referral
    ) internal {
        uint256 totalFee = (amount * totalFeeBps) / BPS_DENOMINATOR;
        if (totalFee == 0) return;

        if (referral != address(0) && referral != address(this)) {
            uint256 builderFee = (amount * builderFeeBps) / BPS_DENOMINATOR;
            uint256 protocolFee = totalFee - builderFee;

            IERC20(token).safeTransfer(referral, builderFee);
            IERC20(token).safeTransfer(protocolTreasury, protocolFee);
            emit FeeDistributed(token, protocolFee, builderFee, referral);
        } else {
            IERC20(token).safeTransfer(protocolTreasury, totalFee);
            emit FeeDistributed(token, totalFee, 0, address(0));
        }
    }

    // --- Entrypoint Público ---
    function executeAction(
        ActionType action,
        TargetProtocol protocol,
        address loanToken,
        uint256 loanAmount,
        address referral,
        SwapParams calldata swap
    ) external nonReentrant {
        _currentContext = ExecutionContext({
            action: action,
            protocol: protocol,
            initiator: msg.sender,
            referral: referral,
            loanToken: loanToken,
            loanAmount: loanAmount,
            swap: swap
        });

        morpho.flashLoan(loanToken, loanAmount, "");
        delete _currentContext;
    }
}
