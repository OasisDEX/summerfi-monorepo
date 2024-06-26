// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "./ArkAccessControl.sol";

contract Ark is ArkAccessControl {
    address public raft;

    event Harvested(uint256 amount);
    event Boarded(address indexed commander, uint256 amount);
    event Disembarked(address indexed commander, uint256 amount);
    event Moved(address indexed commander, uint256 amount, address indexed newArk);
    event DepositCapUpdated(uint256 newCap);
    event RaftUpdated(address newRaft);

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
