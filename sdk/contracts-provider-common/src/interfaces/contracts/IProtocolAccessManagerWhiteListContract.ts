import { IAddress, TransactionInfo, type HexData } from '@summerfi/sdk-common'
import { IContractWrapper } from './IContractWrapper'

/**
 * @name IProtocolAccessManagerWhiteListContract
 * @description Interface for the ProtocolAccessManagerWhiteList contract wrapper
 */
export interface IProtocolAccessManagerWhiteListContract extends IContractWrapper {
  /** READ METHODS */

  /**
   * @name hasRole
   * @description Checks if an account has a specific role
   * @param role The role identifier
   * @param account The account address to check
   * @returns Promise<boolean> True if the account has the role
   */
  hasRole(params: { role: HexData; account: IAddress }): Promise<boolean>

  /**
   * @name generateRole
   * @description Generates a role identifier for contract-specific roles
   * @param roleName The role name enum value
   * @param roleTargetContract The target contract address
   * @returns Promise<string> The generated role identifier
   */
  generateRole(params: { roleName: number; roleTargetContract: IAddress }): Promise<string>

  /**
   * @name guardianExpirations
   * @description Gets the expiration timestamp for a guardian
   * @param guardian The guardian address
   * @returns Promise<bigint> The expiration timestamp
   */
  guardianExpirations(params: { guardian: IAddress }): Promise<bigint>

  /**
   * @name GOVERNOR_ROLE
   * @description Returns the governor role identifier
   * @returns Promise<string> The governor role identifier
   */
  GOVERNOR_ROLE(): Promise<string>

  /**
   * @name SUPER_KEEPER_ROLE
   * @description Returns the super keeper role identifier
   * @returns Promise<string> The super keeper role identifier
   */
  SUPER_KEEPER_ROLE(): Promise<string>

  /**
   * @name DECAY_CONTROLLER_ROLE
   * @description Returns the decay controller role identifier
   * @returns Promise<string> The decay controller role identifier
   */
  DECAY_CONTROLLER_ROLE(): Promise<string>

  /**
   * @name ADMIRALS_QUARTERS_ROLE
   * @description Returns the admirals quarters role identifier
   * @returns Promise<string> The admirals quarters role identifier
   */
  ADMIRALS_QUARTERS_ROLE(): Promise<string>

  /** WRITE METHODS */

  /**
   * @name grantGovernorRole
   * @description Grants the governor role to an account
   * @param account The account to grant the role to
   * @returns Promise<TransactionInfo> The transaction information
   */
  grantGovernorRole(params: { account: IAddress }): Promise<TransactionInfo>

  /**
   * @name revokeGovernorRole
   * @description Revokes the governor role from an account
   * @param account The account to revoke the role from
   * @returns Promise<TransactionInfo> The transaction information
   */
  revokeGovernorRole(params: { account: IAddress }): Promise<TransactionInfo>

  /**
   * @name grantSuperKeeperRole
   * @description Grants the super keeper role to an account
   * @param account The account to grant the role to
   * @returns Promise<TransactionInfo> The transaction information
   */
  grantSuperKeeperRole(params: { account: IAddress }): Promise<TransactionInfo>

  /**
   * @name revokeSuperKeeperRole
   * @description Revokes the super keeper role from an account
   * @param account The account to revoke the role from
   * @returns Promise<TransactionInfo> The transaction information
   */
  revokeSuperKeeperRole(params: { account: IAddress }): Promise<TransactionInfo>

  /**
   * @name grantWhitelistedRole
   * @description Grants the whitelisted role to an account for a specific fleet commander
   * @param fleetCommanderAddress The fleet commander contract address
   * @param account The account to grant the role to
   * @returns Promise<TransactionInfo> The transaction information
   */
  grantWhitelistedRole(params: {
    fleetCommanderAddress: IAddress
    account: IAddress
  }): Promise<TransactionInfo>

  /**
   * @name revokeWhitelistedRole
   * @description Revokes the whitelisted role from an account for a specific fleet commander
   * @param fleetCommanderAddress The fleet commander contract address
   * @param account The account to revoke the role from
   * @returns Promise<TransactionInfo> The transaction information
   */
  revokeWhitelistedRole(params: {
    fleetCommanderAddress: IAddress
    account: IAddress
  }): Promise<TransactionInfo>

  /**
   * @name grantCuratorRole
   * @description Grants the curator role to an account for a specific fleet commander
   * @param fleetCommanderAddress The fleet commander contract address
   * @param account The account to grant the role to
   * @returns Promise<TransactionInfo> The transaction information
   */
  grantCuratorRole(params: {
    fleetCommanderAddress: IAddress
    account: IAddress
  }): Promise<TransactionInfo>

  /**
   * @name revokeCuratorRole
   * @description Revokes the curator role from an account for a specific fleet commander
   * @param fleetCommanderAddress The fleet commander contract address
   * @param account The account to revoke the role from
   * @returns Promise<TransactionInfo> The transaction information
   */
  revokeCuratorRole(params: {
    fleetCommanderAddress: IAddress
    account: IAddress
  }): Promise<TransactionInfo>

  /**
   * @name grantKeeperRole
   * @description Grants the keeper role to an account for a specific fleet commander
   * @param fleetCommanderAddress The fleet commander contract address
   * @param account The account to grant the role to
   * @returns Promise<TransactionInfo> The transaction information
   */
  grantKeeperRole(params: {
    fleetCommanderAddress: IAddress
    account: IAddress
  }): Promise<TransactionInfo>

  /**
   * @name revokeKeeperRole
   * @description Revokes the keeper role from an account for a specific fleet commander
   * @param fleetCommanderAddress The fleet commander contract address
   * @param account The account to revoke the role from
   * @returns Promise<TransactionInfo> The transaction information
   */
  revokeKeeperRole(params: {
    fleetCommanderAddress: IAddress
    account: IAddress
  }): Promise<TransactionInfo>

  /**
   * @name grantCommanderRole
   * @description Grants the commander role to an account for a specific ark
   * @param arkAddress The ark contract address
   * @param account The account to grant the role to
   * @returns Promise<TransactionInfo> The transaction information
   */
  grantCommanderRole(params: { arkAddress: IAddress; account: IAddress }): Promise<TransactionInfo>

  /**
   * @name revokeCommanderRole
   * @description Revokes the commander role from an account for a specific ark
   * @param arkAddress The ark contract address
   * @param account The account to revoke the role from
   * @returns Promise<TransactionInfo> The transaction information
   */
  revokeCommanderRole(params: { arkAddress: IAddress; account: IAddress }): Promise<TransactionInfo>

  /**
   * @name grantDecayControllerRole
   * @description Grants the decay controller role to an account
   * @param account The account to grant the role to
   * @returns Promise<TransactionInfo> The transaction information
   */
  grantDecayControllerRole(params: { account: IAddress }): Promise<TransactionInfo>

  /**
   * @name revokeDecayControllerRole
   * @description Revokes the decay controller role from an account
   * @param account The account to revoke the role from
   * @returns Promise<TransactionInfo> The transaction information
   */
  revokeDecayControllerRole(params: { account: IAddress }): Promise<TransactionInfo>

  /**
   * @name grantAdmiralsQuartersRole
   * @description Grants the admirals quarters role to an account
   * @param account The account to grant the role to
   * @returns Promise<TransactionInfo> The transaction information
   */
  grantAdmiralsQuartersRole(params: { account: IAddress }): Promise<TransactionInfo>

  /**
   * @name revokeAdmiralsQuartersRole
   * @description Revokes the admirals quarters role from an account
   * @param account The account to revoke the role from
   * @returns Promise<TransactionInfo> The transaction information
   */
  revokeAdmiralsQuartersRole(params: { account: IAddress }): Promise<TransactionInfo>

  /**
   * @name selfRevokeContractSpecificRole
   * @description Allows an account to revoke its own contract-specific role
   * @param roleName The role name enum value
   * @param roleTargetContract The target contract address
   * @returns Promise<TransactionInfo> The transaction information
   */
  selfRevokeContractSpecificRole(params: {
    roleName: number
    roleTargetContract: IAddress
  }): Promise<TransactionInfo>
}
