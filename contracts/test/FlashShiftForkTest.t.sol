// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {FlashShiftRouter} from "../src/FlashShiftRouter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPool} from "../src/interfaces/IAaveV3.sol";
import {IMorpho} from "../src/interfaces/IMorpho.sol";

contract FlashShiftForkTest is Test {
    FlashShiftRouter public router;

    address public constant MORPHO = 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb;
    address public constant AAVE_POOL = 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5;
    address public constant KYBER_ROUTER = 0x6131B5fae19EA4f9D964eAc0408E4408b66337b5;
    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address public constant WETH = 0x4200000000000000000000000000000000000006;

    address public treasury = address(0x999);
    address public user = address(0x111);

    function setUp() public {
        try vm.activeFork() returns (uint256) {} catch {
            vm.createSelectFork("https://mainnet.base.org");
        }
        router = new FlashShiftRouter(MORPHO, AAVE_POOL, treasury, KYBER_ROUTER);
    }

    function test_Morpho_FlashLoanLiquidityAvailable() public view {
        uint256 usdcBalance = IERC20(USDC).balanceOf(MORPHO);
        uint256 wethBalance = IERC20(WETH).balanceOf(MORPHO);
        assertGt(usdcBalance, 1_000_000 * 1e6);
        assertGt(wethBalance, 1_000 * 1e18);
    }

    function test_Aave_ReadUserDataOnBase() public view {
        (
            uint256 totalCollateralBase,
            uint256 totalDebtBase,
            ,
            ,
            ,
            uint256 healthFactor
        ) = IPool(AAVE_POOL).getUserAccountData(user);

        console.log("Lectura de Aave v3 Base para usuario:", user);
        console.log("  Health Factor:", healthFactor);
    }
}
