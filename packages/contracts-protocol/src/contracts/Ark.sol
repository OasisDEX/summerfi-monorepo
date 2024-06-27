// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.26;

import "./ArkAccessControl.sol";
import "../interfaces/IArk.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @custom:see IArk
 */
abstract contract BaseArk is IArk, ArkAccessControl {
    address public raft;
    uint256 public depositCap;
    IERC20 public token;

    constructor(ArkParams memory params) ArkAccessControl(params.governor) {
        raft = params.raft;
        token = IERC20(params.token);
    }

    /* PUBLIC */
    function balance() public view returns (uint256) {}
    function harvest() public {}

    /* EXTERNAL - COMMANDER */
    function board(uint256 amount) external virtual;
    function disembark(uint256 amount) external virtual;
    function move(uint256 amount, address newArk) external virtual;

    /* EXTERNAL - GOVERNANCE */
    function setDepositCap(uint256 newCap) external onlyGovernor {}
    function setRaft(address newRaft) external onlyGovernor {}
}
