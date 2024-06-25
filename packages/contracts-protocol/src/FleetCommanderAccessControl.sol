// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract FleetCommanderAccessControl is AccessControl {
    bytes32 public constant GOVERNOR_ROLE = keccak256("GOVERNOR_ROLE");
    bytes32 public constant KEEPER_ROLE = keccak256("KEEPER_ROLE");

    constructor(address governor) {
        _grantRole(GOVERNOR_ROLE, governor);
    }

    modifier onlyGovernor() {
        require(hasRole(GOVERNOR_ROLE, msg.sender), "Caller is not a governor");
        _;
    }

    modifier onlyKeeper() {
        require(hasRole(KEEPER_ROLE, msg.sender), "Caller is not a keeper");
        _;
    }

    function grantGovernorRole(address account) external onlyGovernor {
        grantRole(GOVERNOR_ROLE, account);
    }

    function revokeGovernorRole(address account) external onlyGovernor {
        revokeRole(GOVERNOR_ROLE, account);
    }

    function grantKeeperRole(address account) external onlyGovernor {
        grantRole(KEEPER_ROLE, account);
    }

    function revokeKeeperRole(address account) external onlyGovernor {
        revokeRole(KEEPER_ROLE, account);
    }
}
