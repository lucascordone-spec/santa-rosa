// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {FlashShiftRouter} from "../src/FlashShiftRouter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FlashShiftRouterTest is Test {
    FlashShiftRouter public router;
    address public constant MORPHO = 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb;
    address public constant AAVE_POOL = 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5;
    address public constant KYBER_ROUTER = 0x6131B5fae19EA4f9D964eAc0408E4408b66337b5;
    address public treasury = address(0x999);
    address public builder = address(0x888);
    address public user = address(0x111);

    function setUp() public {
        router = new FlashShiftRouter(MORPHO, AAVE_POOL, treasury, KYBER_ROUTER);
    }

    function test_Security_UnauthorizedCallbackReverts() public {
        vm.prank(user);
        vm.expectRevert(FlashShiftRouter.UnauthorizedCallback.selector);
        router.onMorphoFlashLoan(1000e6, "");
    }

    function test_Security_ConstantsVerification() public view {
        assertEq(router.RESCUE_TOTAL_FEE_BPS(), 25);
        assertEq(router.RESCUE_PROTOCOL_BPS(), 20);
        assertEq(router.RESCUE_BUILDER_BPS(), 5);
        assertEq(router.LEVERAGE_TOTAL_FEE_BPS(), 10);
        assertEq(router.LEVERAGE_PROTOCOL_BPS(), 8);
        assertEq(router.LEVERAGE_BUILDER_BPS(), 2);
        assertTrue(router.isApprovedAggregator(KYBER_ROUTER));
    }
}
