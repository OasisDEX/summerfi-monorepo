import type {
  ChainId,
  IAddress,
  TransactionInfo,
  AddressValue,
  ContractSpecificRoleName,
  GlobalRoles,
  RolesResponse,
} from '@summerfi/sdk-common'

/**
 * @name IArmadaManagerClientAccessControl
 * @description Interface for the Armada Manager Access Control client - handles role-based access control operations
 */
export interface IArmadaManagerClientAccessControl {
  /**
   * @name hasGlobalRole
   * @description Checks if an address has a specific global protocol role
   *
   * @param chainId The chain ID to check the role on
   * @param role The global role to check
   * @param targetAddress The address to check for the role
   *
   * @returns Promise<boolean> True if the address has the role
   */
  hasGlobalRole(params: {
    chainId: ChainId
    role: GlobalRoles
    targetAddress: IAddress
  }): Promise<boolean>

  /**
   * @name hasContractSpecificRole
   * @description Checks if an address has a specific contract-specific role
   *
   * @param chainId The chain ID to check the role on
   * @param role The contract-specific role to check
   * @param contractAddress The target contract address
   * @param targetAddress The address to check for the role
   *
   * @returns Promise<boolean> True if the target address has the role
   */
  hasContractSpecificRole(params: {
    chainId: ChainId
    role: ContractSpecificRoleName
    contractAddress: IAddress
    targetAddress: IAddress
  }): Promise<boolean>

  /**
   * @name grantGlobalRole
   * @description Grants a global protocol role to an address
   *
   * @param chainId The chain ID to grant the role on
   * @param role The global role to grant
   * @param targetAddress The address to grant the role to
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  grantGlobalRole(params: {
    chainId: ChainId
    role: GlobalRoles
    targetAddress: IAddress
  }): Promise<TransactionInfo>

  /**
   * @name revokeGlobalRole
   * @description Revokes a global protocol role from an address
   *
   * @param chainId The chain ID to revoke the role on
   * @param role The global role to revoke
   * @param targetAddress The address to revoke the role from
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  revokeGlobalRole(params: {
    chainId: ChainId
    role: GlobalRoles
    targetAddress: IAddress
  }): Promise<TransactionInfo>

  /**
   * @name grantContractSpecificRole
   * @description Grants a contract-specific role to an address
   *
   * @param chainId The chain ID to grant the role on
   * @param role The contract-specific role to grant
   * @param contractAddress The target contract address
   * @param targetAddress The address to grant the role to
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  grantContractSpecificRole(params: {
    chainId: ChainId
    role: ContractSpecificRoleName
    contractAddress: IAddress
    targetAddress: IAddress
  }): Promise<TransactionInfo>

  /**
   * @name revokeContractSpecificRole
   * @description Revokes a contract-specific role from an address
   *
   * @param chainId The chain ID to revoke the role on
   * @param role The contract-specific role to revoke
   * @param contractAddress The target contract address
   * @param targetAddress The address to revoke the role from
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  revokeContractSpecificRole(params: {
    chainId: ChainId
    role: ContractSpecificRoleName
    contractAddress: IAddress
    targetAddress: IAddress
  }): Promise<TransactionInfo>

  /**
   * @name getAllAddressesWithGlobalRole
   * @description Gets all addresses that currently have a specific global protocol role
   *
   * @param chainId The chain ID to check the role on
   * @param role The global role to check for
   *
   * @returns Promise<AddressValue[]> Array of addresses that have the role
   */
  getAllAddressesWithGlobalRole(params: {
    chainId: ChainId
    role: GlobalRoles
  }): Promise<AddressValue[]>

  /**
   * @name getAllAddressesWithContractSpecificRole
   * @description Gets all addresses that currently have a specific contract-specific role
   *
   * @param chainId The chain ID to check the role on
   * @param role The contract-specific role to check for
   * @param contractAddress The target contract address
   *
   * @returns Promise<AddressValue[]> Array of addresses that have the role
   */
  getAllAddressesWithContractSpecificRole(params: {
    chainId: ChainId
    role: ContractSpecificRoleName
    contractAddress: IAddress
  }): Promise<AddressValue[]>

  /**
   * @name isWhitelisted
   * @description Checks if an address is whitelisted in the FleetCommander contract
   *
   * @param chainId The chain ID to check the whitelist status on
   * @param fleetCommanderAddress The FleetCommander contract address
   * @param account The address to check for whitelist status
   *
   * @returns Promise<boolean> True if the address is whitelisted
   */
  isWhitelisted(params: {
    chainId: ChainId
    fleetCommanderAddress: AddressValue
    account: AddressValue
  }): Promise<boolean>

  /**
   * @name setWhitelisted
   * @description Sets the whitelist status for an address in the FleetCommander contract
   *
   * @param chainId The chain ID to set the whitelist status on
   * @param fleetCommanderAddress The FleetCommander contract address
   * @param account The address to set the whitelist status for
   * @param allowed The whitelist status to set
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  setWhitelisted(params: {
    chainId: ChainId
    fleetCommanderAddress: AddressValue
    account: AddressValue
    allowed: boolean
  }): Promise<TransactionInfo>

  /**
   * @name setWhitelistedBatch
   * @description Sets the whitelist status for multiple addresses in the FleetCommander contract
   *
   * @param chainId The chain ID to set the whitelist status on
   * @param fleetCommanderAddress The FleetCommander contract address
   * @param accounts The addresses to set the whitelist status for
   * @param allowed The whitelist statuses to set (must match the length of accounts)
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  setWhitelistedBatch(params: {
    chainId: ChainId
    fleetCommanderAddress: AddressValue
    accounts: AddressValue[]
    allowed: boolean[]
  }): Promise<TransactionInfo>

  /**
   * @name getAllRoles
   * @description Gets all roles for a given chainId with pagination and filtering support
   *
   * @param chainId The chain ID to get roles for
   * @param first Number of items to return (default: 1000)
   * @param skip Number of items to skip for pagination (default: 0)
   * @param name Optional role name filter
   * @param targetContract Optional target contract address filter
   * @param owner Optional owner address filter
   *
   * @returns Promise with array of role objects containing id, name, owner, targetContract, and institution
   */
  getAllRoles(params: {
    chainId: ChainId
    first?: number
    skip?: number
    name?: string
    targetContract?: AddressValue
    owner?: AddressValue
  }): Promise<RolesResponse>
}
