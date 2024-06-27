// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "./ArkAccessControl.sol";
import "../interfaces/IArk.sol";

/**
 * @custom:see IArk
 */
contract Ark is IArk, ArkAccessControl {
    address public raft;

    constructor(address _governor, address _raft) ArkAccessControl(_governor) {
        raft = _raft;
    }

    /* PUBLIC */
    function balance() public view returns (uint256) {}
    function harvest() public {}

    /* EXTERNAL - COMMANDER */
    function board(uint256 amount) external onlyCommander {}
    function disembark(uint256 amount) external onlyCommander {}
    function move(uint256 amount, address newArk) external onlyCommander {}

    /* EXTERNAL - GOVERNANCE */
    function setDepositCap(uint256 newCap) external onlyGovernor {}
    function setRaft(address newRaft) external onlyGovernor {}
}
