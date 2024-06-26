// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ArkAccessControl is AccessControl {
    bytes32 public constant GOVERNOR_ROLE = keccak256("GOVERNOR_ROLE");
    bytes32 public constant KEEPER_ROLE = keccak256("KEEPER_ROLE");
    bytes32 public constant COMMANDER_ROLE = keccak256("COMMANDER_ROLE");

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

    modifier onlyCommander() {
        require(hasRole(COMMANDER_ROLE, msg.sender), "Caller is not a commander");
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

    function grantCommanderRole(address account) external onlyCommander {
        grantRole(COMMANDER_ROLE, account);
    }

    function revokeCommanderRole(address account) external onlyCommander {
        revokeRole(COMMANDER_ROLE, account);
    }
}
