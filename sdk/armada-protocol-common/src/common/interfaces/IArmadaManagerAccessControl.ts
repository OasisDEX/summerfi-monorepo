import type {
  ChainId,
  IAddress,
  TransactionInfo,
  AddressValue,
  GeneralRoles,
  ContractSpecificRoleName,
} from '@summerfi/sdk-common'

/**
 * @name IArmadaManagerAccessControl
 * @description Interface for the Armada Manager Access Control module which handles role-based access control operations
 */
export interface IArmadaManagerAccessControl {
  /**
   * @name hasGeneralRole
   * @description Checks if an address has a specific general protocol role
   *
   * @param chainId The chain ID to check the role on
   * @param role The general role to check
   * @param targetAddress The address to check for the role
   *
   * @returns Promise<boolean> True if the address has the role
   */
  hasGeneralRole(params: {
    chainId: ChainId
    role: GeneralRoles
    targetAddress: IAddress
  }): Promise<boolean>

  /**
   * @name hasContractSpecificRole
   * @description Checks if an address has a specific contract-specific role
   *
   * @param chainId The chain ID to check the role on
   * @param role The contract-specific role to check
   * @param contractAddress The target contract address fleet or ark
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
   * @name grantGeneralRole
   * @description Grants a general protocol role to an address
   *
   * @param chainId The chain ID to grant the role on
   * @param role The general role to grant
   * @param targetAddress The address to grant the role to
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  grantGeneralRole(params: {
    chainId: ChainId
    role: GeneralRoles
    targetAddress: IAddress
  }): Promise<TransactionInfo>

  /**
   * @name revokeGeneralRole
   * @description Revokes a general protocol role from an address
   *
   * @param chainId The chain ID to revoke the role on
   * @param role The general role to revoke
   * @param targetAddress The address to revoke the role from
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  revokeGeneralRole(params: {
    chainId: ChainId
    role: GeneralRoles
    targetAddress: IAddress
  }): Promise<TransactionInfo>

  /**
   * @name grantContractSpecificRole
   * @description Grants a contract-specific role to an address
   *
   * @param chainId The chain ID to grant the role on
   * @param role The contract-specific role to grant
   * @param contractAddress The target contract address fleet or ark
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
   * @name getAllAddressesWithGeneralRole
   * @description Gets all addresses that currently have a specific general protocol role
   *
   * @param chainId The chain ID to check the role on
   * @param role The general role to check for
   *
   * @returns Promise<AddressValue[]> Array of addresses that have the role
   */
  getAllAddressesWithGeneralRole(params: {
    chainId: ChainId
    role: GeneralRoles
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
}
