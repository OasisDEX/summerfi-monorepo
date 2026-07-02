import type {
  ChainId,
  IAddress,
  TransactionInfo,
  AddressValue,
  InstiContractRoles,
  GlobalRoles,
  RolesResponse,
} from '@summerfi/sdk-common'

/**
 * Interface for the Armada Manager Access Control client - handles role-based access control operations
 */
export interface IArmadaManagerClientAccessControl {
  /**
   * Checks if an address has a specific global protocol role
   *
   * @param params.chainId The chain ID to check the role on
   * @param params.role The global role to check
   * @param params.targetAddress The address to check for the role
   *
   * @returns Promise<boolean> True if the address has the role
   */
  hasGlobalRole(params: {
    chainId: ChainId
    role: GlobalRoles
    targetAddress: IAddress
  }): Promise<boolean>

  /**
   * Checks if an address has a specific contract-specific role
   *
   * @param params.chainId The chain ID to check the role on
   * @param params.role The contract-specific role to check
   * @param params.contractAddress The target contract address
   * @param params.targetAddress The address to check for the role
   *
   * @returns Promise<boolean> True if the target address has the role
   */
  hasContractSpecificRole(params: {
    chainId: ChainId
    role: InstiContractRoles
    contractAddress: IAddress
    targetAddress: IAddress
  }): Promise<boolean>

  /**
   * Grants a global protocol role to an address
   *
   * @param params.chainId The chain ID to grant the role on
   * @param params.role The global role to grant
   * @param params.targetAddress The address to grant the role to
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  grantGlobalRole(params: {
    chainId: ChainId
    role: GlobalRoles
    targetAddress: IAddress
  }): Promise<TransactionInfo>

  /**
   * Revokes a global protocol role from an address
   *
   * @param params.chainId The chain ID to revoke the role on
   * @param params.role The global role to revoke
   * @param params.targetAddress The address to revoke the role from
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  revokeGlobalRole(params: {
    chainId: ChainId
    role: GlobalRoles
    targetAddress: IAddress
  }): Promise<TransactionInfo>

  /**
   * Grants a contract-specific role to an address
   *
   * @param params.chainId The chain ID to grant the role on
   * @param params.role The contract-specific role to grant
   * @param params.contractAddress The target contract address
   * @param params.targetAddress The address to grant the role to
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  grantContractSpecificRole(params: {
    chainId: ChainId
    role: InstiContractRoles
    contractAddress: IAddress
    targetAddress: IAddress
  }): Promise<TransactionInfo>

  /**
   * Revokes a contract-specific role from an address
   *
   * @param params.chainId The chain ID to revoke the role on
   * @param params.role The contract-specific role to revoke
   * @param params.contractAddress The target contract address
   * @param params.targetAddress The address to revoke the role from
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  revokeContractSpecificRole(params: {
    chainId: ChainId
    role: InstiContractRoles
    contractAddress: IAddress
    targetAddress: IAddress
  }): Promise<TransactionInfo>

  /**
   * Gets all addresses that currently have a specific global protocol role
   *
   * @param params.chainId The chain ID to check the role on
   * @param params.role The global role to check for
   *
   * @returns Promise<AddressValue[]> Array of addresses that have the role
   */
  getAllAddressesWithGlobalRole(params: {
    chainId: ChainId
    role: GlobalRoles
  }): Promise<AddressValue[]>

  /**
   * Gets all addresses that currently have a specific contract-specific role
   *
   * @param params.chainId The chain ID to check the role on
   * @param params.role The contract-specific role to check for
   * @param params.contractAddress The target contract address
   *
   * @returns Promise<AddressValue[]> Array of addresses that have the role
   */
  getAllAddressesWithContractSpecificRole(params: {
    chainId: ChainId
    role: InstiContractRoles
    contractAddress: IAddress
  }): Promise<AddressValue[]>

  /**
   * Checks if an address is whitelisted in the FleetCommander contract
   *
   * @param params.chainId The chain ID to check the whitelist status on
   * @param params.fleetCommanderAddress The FleetCommander contract address
   * @param params.targetAddress The address to check for whitelist status
   *
   * @returns Promise<boolean> True if the address is whitelisted
   */
  isWhitelisted(params: {
    chainId: ChainId
    fleetCommanderAddress: AddressValue
    targetAddress: AddressValue
  }): Promise<boolean>

  /**
   * Sets the whitelist status for an address in the FleetCommander contract
   *
   * @param params.chainId The chain ID to set the whitelist status on
   * @param params.fleetCommanderAddress The FleetCommander contract address
   * @param params.targetAddress The address to set the whitelist status for
   * @param params.allowed The whitelist status to set
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  setWhitelisted(params: {
    chainId: ChainId
    fleetCommanderAddress: AddressValue
    targetAddress: AddressValue
    allowed: boolean
  }): Promise<TransactionInfo>

  /**
   * Sets the whitelist status for multiple addresses in the FleetCommander contract
   *
   * @param params.chainId The chain ID to set the whitelist status on
   * @param params.fleetCommanderAddress The FleetCommander contract address
   * @param params.targetAddresses The addresses to set the whitelist status for
   * @param params.allowed The whitelist statuses to set (must match the length of targetAddresses)
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  setWhitelistedBatch(params: {
    chainId: ChainId
    fleetCommanderAddress: AddressValue
    targetAddresses: AddressValue[]
    allowed: boolean[]
  }): Promise<TransactionInfo>

  /**
   * Checks if an address is whitelisted in the AdmiralsQuarters contract
   *
   * @param params.chainId The chain ID to check the whitelist status on
   * @param params.targetAddress The address to check for whitelist status
   *
   * @returns Promise<boolean> True if the address is whitelisted
   */
  isWhitelistedAQ(params: { chainId: ChainId; targetAddress: AddressValue }): Promise<boolean>

  /**
   * Sets the whitelist status for an address in the AdmiralsQuarters contract
   *
   * @param params.chainId The chain ID to set the whitelist status on
   * @param params.targetAddress The address to set the whitelist status for
   * @param params.allowed The whitelist status to set
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  setWhitelistedAQ(params: {
    chainId: ChainId
    targetAddress: AddressValue
    allowed: boolean
  }): Promise<TransactionInfo>

  /**
   * Sets the whitelist status for multiple addresses in the AdmiralsQuarters contract
   *
   * @param params.chainId The chain ID to set the whitelist status on
   * @param params.targetAddresses The addresses to set the whitelist status for
   * @param params.allowed The whitelist statuses to set (must match the length of targetAddresses)
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  setWhitelistedBatchAQ(params: {
    chainId: ChainId
    targetAddresses: AddressValue[]
    allowed: boolean[]
  }): Promise<TransactionInfo>

  /**
   * Gets all roles for a given chainId with pagination and filtering support
   *
   * @param params.chainId The chain ID to get roles for
   * @param params.first Number of items to return (default: 1000)
   * @param params.skip Number of items to skip for pagination (default: 0)
   * @param params.name Optional role name filter
   * @param params.targetContract Optional target contract address filter
   * @param params.owner Optional owner address filter
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
