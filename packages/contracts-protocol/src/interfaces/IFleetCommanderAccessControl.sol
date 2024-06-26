// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title IFleetCommanderAccessControl
 * @notice Defines the specific roles for the FleetCommander contract and the
 *         helper functions to manage them and to enforce the access control
 */
interface IFleetCommanderAccessControl {
    /** ERRORS */
    error CallerIsNotGovernor(address caller);
    error CallerIsNotKeeper(address caller);

    /** FUNCTIONS */

    /**
     * @notice Grants the Governor role to a given account
     *   
     * @param account The account to which the Governor role will be granted
     */
    function grantGovernorRole(address account) external;

    

    /**
     * @notice Revokes the Governor role from a given account
     *   
     * @param account The account from which the Governor role will be revoked
     */
    // TODO: I'm worried that if by mistake we revoke the last governor role, the contract will be bricked.
    // TODO: I think that AccessControl has the concept of admin of roles, in which each role has an admin that can manage it.
    // TODO: By default this is the role 0x0. Perhaps we can levarage that to prevent the issue
    function revokeGovernorRole(address account) external;

    /**
     * @notice Grants the Keeper role to a given account
     *   
     * @param account The account to which the Keeper role will be granted
     */
    function grantKeeperRole(address account) external;

    /**
     * @notice Revokes the Keeper role from a given account
     *   
     * @param account The account from which the Keeper role will be revoked
     */
    function revokeKeeperRole(address account) external;
}
