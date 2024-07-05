// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.26;

import "../Ark.sol";
import {IComet} from "../../interfaces/compound-v3/IComet.sol";
import {IArk} from "../../interfaces/IArk.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract CompoundV3Ark is Ark {
    using SafeERC20 for IERC20;

    IComet public comet;

    constructor(address _comet, ArkParams memory _params) Ark(_params) {
        comet = IComet(_comet);
    }

    function _board(uint256 amount) internal override {
        token.approve(address(comet), amount);
        comet.supply(address(token), amount);
    }

    function _disembark(uint256 amount) internal override {
        comet.withdraw(address(token), amount);
    }
}
