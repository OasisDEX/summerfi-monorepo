import type { IArmadaManagerAccessControl } from '@summerfi/armada-protocol-common'
import { GeneralRoles, GENERAL_ROLE_HASHES } from '@summerfi/armada-protocol-common'
import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider, ContractSpecificRoleName } from '@summerfi/contracts-provider-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import {
  IAddress,
  TransactionInfo,
  getChainInfoByChainId,
  type HexData,
  type ChainInfo,
  type ChainId,
} from '@summerfi/sdk-common'
import type { IDeploymentProvider } from '../../deployment-provider/IDeploymentProvider'

/**
 * @name ArmadaManagerAccessControl
 * @description Implementation of the IArmadaManagerAccessControl interface. Handles role-based access control operations for Armada Protocol
 */
export class ArmadaManagerAccessControl implements IArmadaManagerAccessControl {
  private _configProvider: IConfigurationProvider
  private _contractsProvider: IContractsProvider
  private _blockchainClientProvider: IBlockchainClientProvider
  private _deploymentProvider: IDeploymentProvider
  private _roleHashes: Record<GeneralRoles, HexData | null> = { ...GENERAL_ROLE_HASHES }

  /** CONSTRUCTOR */
  constructor(params: {
    configProvider: IConfigurationProvider
    contractsProvider: IContractsProvider
    blockchainClientProvider: IBlockchainClientProvider
    deploymentProvider: IDeploymentProvider
  }) {
    this._configProvider = params.configProvider
    this._contractsProvider = params.contractsProvider
    this._blockchainClientProvider = params.blockchainClientProvider
    this._deploymentProvider = params.deploymentProvider
  }

  /**
   * @description Gets the protocol access manager contract address from deployment config
   */
  private _getProtocolAccessManagerAddress(chainInfo: ChainInfo): IAddress {
    return this._deploymentProvider.getDeployedContractAddress({
      contractName: 'protocolAccessManager',
      chainId: chainInfo.chainId,
    })
  }

  /**
   * @description Gets the general role hash for a given role
   * This method caches the role hashes to avoid redundant contract calls
   */
  private async _getGeneralRoleHash(chainId: ChainId, role: GeneralRoles): Promise<HexData> {
    if (this._roleHashes[role] !== null) {
      return this._roleHashes[role] as HexData
    }

    // Get the hub chain info
    const chainInfo = getChainInfoByChainId(Number(chainId))

    // Get the protocol access manager contract
    const protocolAccessManagerContract =
      await this._contractsProvider.getProtocolAccessManagerWhiteListContract({
        chainInfo,
        address: this._getProtocolAccessManagerAddress(chainInfo),
      })

    // Get the role hash based on the role type
    let roleHash: HexData
    switch (role) {
      case GeneralRoles.GOVERNOR_ROLE:
        roleHash = await protocolAccessManagerContract.GOVERNOR_ROLE()
        break
      case GeneralRoles.SUPER_KEEPER_ROLE:
        roleHash = await protocolAccessManagerContract.SUPER_KEEPER_ROLE()
        break
      case GeneralRoles.DECAY_CONTROLLER_ROLE:
        roleHash = await protocolAccessManagerContract.DECAY_CONTROLLER_ROLE()
        break
      case GeneralRoles.ADMIRALS_QUARTERS_ROLE:
        roleHash = await protocolAccessManagerContract.ADMIRALS_QUARTERS_ROLE()
        break
      default:
        throw new Error(`Unsupported general role: ${role}`)
    }

    // Cache the result
    this._roleHashes[role] = roleHash
    return roleHash
  }

  /** @see IArmadaManagerAccessControl.hasGeneralRole */
  async hasGeneralRole(params: {
    chainId: ChainId
    role: GeneralRoles
    targetAddress: IAddress
  }): Promise<boolean> {
    const roleHash = await this._getGeneralRoleHash(params.chainId, params.role)

    // Get the chain info from the provided chainId
    const chainInfo = getChainInfoByChainId(Number(params.chainId))

    // Get the protocol access manager contract
    const protocolAccessManagerContract =
      await this._contractsProvider.getProtocolAccessManagerWhiteListContract({
        chainInfo: chainInfo,
        address: this._getProtocolAccessManagerAddress(chainInfo),
      })

    return protocolAccessManagerContract.hasRole({
      role: roleHash,
      account: params.targetAddress,
    })
  }

  /** @see IArmadaManagerAccessControl.hasContractSpecificRole */
  async hasContractSpecificRole(params: {
    chainId: ChainId
    role: ContractSpecificRoleName
    contractAddress: IAddress
    targetAddress: IAddress
  }): Promise<boolean> {
    // Get the chain info from the provided chainId
    const chainInfo = getChainInfoByChainId(Number(params.chainId))

    // Get the protocol access manager contract
    const protocolAccessManagerContract =
      await this._contractsProvider.getProtocolAccessManagerWhiteListContract({
        chainInfo: chainInfo,
        address: this._getProtocolAccessManagerAddress(chainInfo),
      })

    // Generate the role hash for the contract-specific role
    const roleHash = await protocolAccessManagerContract.generateRole({
      roleName: params.role,
      roleTargetContract: params.contractAddress,
    })

    return protocolAccessManagerContract.hasRole({
      role: roleHash,
      account: params.targetAddress,
    })
  }

  /** @see IArmadaManagerAccessControl.grantGeneralRole */
  async grantGeneralRole(params: {
    chainId: ChainId
    role: GeneralRoles
    targetAddress: IAddress
  }): Promise<TransactionInfo> {
    // Get the chain info from the provided chainId
    const chainInfo = getChainInfoByChainId(Number(params.chainId))

    // Get the protocol access manager contract
    const protocolAccessManagerContract =
      await this._contractsProvider.getProtocolAccessManagerWhiteListContract({
        chainInfo: chainInfo,
        address: this._getProtocolAccessManagerAddress(chainInfo),
      })

    // Use the appropriate grant method based on the role
    switch (params.role) {
      case GeneralRoles.GOVERNOR_ROLE:
        return protocolAccessManagerContract.grantGovernorRole({
          account: params.targetAddress,
        })
      case GeneralRoles.SUPER_KEEPER_ROLE:
        return protocolAccessManagerContract.grantSuperKeeperRole({
          account: params.targetAddress,
        })
      case GeneralRoles.DECAY_CONTROLLER_ROLE:
        return protocolAccessManagerContract.grantDecayControllerRole({
          account: params.targetAddress,
        })
      case GeneralRoles.ADMIRALS_QUARTERS_ROLE:
        return protocolAccessManagerContract.grantAdmiralsQuartersRole({
          account: params.targetAddress,
        })
      default:
        throw new Error(`Grant method not implemented for role: ${params.role}`)
    }
  }

  /** @see IArmadaManagerAccessControl.revokeGeneralRole */
  async revokeGeneralRole(params: {
    chainId: ChainId
    role: GeneralRoles
    targetAddress: IAddress
  }): Promise<TransactionInfo> {
    // Get the chain info from the provided chainId
    const chainInfo = getChainInfoByChainId(Number(params.chainId))

    // Get the protocol access manager contract
    const protocolAccessManagerContract =
      await this._contractsProvider.getProtocolAccessManagerWhiteListContract({
        chainInfo: chainInfo,
        address: this._getProtocolAccessManagerAddress(chainInfo),
      })

    // Use the appropriate revoke method based on the role
    switch (params.role) {
      case GeneralRoles.GOVERNOR_ROLE:
        return protocolAccessManagerContract.revokeGovernorRole({
          account: params.targetAddress,
        })
      case GeneralRoles.SUPER_KEEPER_ROLE:
        return protocolAccessManagerContract.revokeSuperKeeperRole({
          account: params.targetAddress,
        })
      case GeneralRoles.DECAY_CONTROLLER_ROLE:
        return protocolAccessManagerContract.revokeDecayControllerRole({
          account: params.targetAddress,
        })
      case GeneralRoles.ADMIRALS_QUARTERS_ROLE:
        return protocolAccessManagerContract.revokeAdmiralsQuartersRole({
          account: params.targetAddress,
        })
      default:
        throw new Error(`Revoke method not implemented for role: ${params.role}`)
    }
  }

  /** @see IArmadaManagerAccessControl.grantContractSpecificRole */
  async grantContractSpecificRole(params: {
    chainId: ChainId
    role: ContractSpecificRoleName
    contractAddress: IAddress
    targetAddress: IAddress
  }): Promise<TransactionInfo> {
    // Get the chain info from the provided chainId
    const chainInfo = getChainInfoByChainId(Number(params.chainId))

    // Get the protocol access manager contract
    const protocolAccessManagerContract =
      await this._contractsProvider.getProtocolAccessManagerWhiteListContract({
        chainInfo: chainInfo,
        address: this._getProtocolAccessManagerAddress(chainInfo),
      })

    // Generate the role hash for the contract-specific role
    const _roleHash = await protocolAccessManagerContract.generateRole({
      roleName: params.role,
      roleTargetContract: params.contractAddress,
    })

    switch (params.role) {
      case ContractSpecificRoleName.KEEPER_ROLE:
        return protocolAccessManagerContract.grantKeeperRole({
          account: params.targetAddress,
          fleetCommanderAddress: params.contractAddress,
        })
      case ContractSpecificRoleName.COMMANDER_ROLE:
        return protocolAccessManagerContract.grantCommanderRole({
          account: params.targetAddress,
          arkAddress: params.contractAddress,
        })
      case ContractSpecificRoleName.CURATOR_ROLE:
        return protocolAccessManagerContract.grantCuratorRole({
          account: params.targetAddress,
          fleetCommanderAddress: params.contractAddress,
        })
      case ContractSpecificRoleName.WHITELISTED_ROLE:
        return protocolAccessManagerContract.grantWhitelistedRole({
          account: params.targetAddress,
          fleetCommanderAddress: params.contractAddress,
        })
      default:
        // If the role is unnknown, throw an error
        throw new Error(`Grant method not implemented for role: ${params.role}`)
    }
  }

  /** @see IArmadaManagerAccessControl.revokeContractSpecificRole */
  async revokeContractSpecificRole(params: {
    chainId: ChainId
    role: ContractSpecificRoleName
    contractAddress: IAddress
    targetAddress: IAddress
  }): Promise<TransactionInfo> {
    // Get the chain info from the provided chainId
    const chainInfo = getChainInfoByChainId(Number(params.chainId))

    // Get the protocol access manager contract
    const protocolAccessManagerContract =
      await this._contractsProvider.getProtocolAccessManagerWhiteListContract({
        chainInfo: chainInfo,
        address: this._getProtocolAccessManagerAddress(chainInfo),
      })

    switch (params.role) {
      case ContractSpecificRoleName.KEEPER_ROLE:
        return protocolAccessManagerContract.revokeKeeperRole({
          account: params.targetAddress,
          fleetCommanderAddress: params.contractAddress,
        })
      case ContractSpecificRoleName.COMMANDER_ROLE:
        return protocolAccessManagerContract.revokeCommanderRole({
          account: params.targetAddress,
          arkAddress: params.contractAddress,
        })
      case ContractSpecificRoleName.CURATOR_ROLE:
        return protocolAccessManagerContract.revokeCuratorRole({
          account: params.targetAddress,
          fleetCommanderAddress: params.contractAddress,
        })
      case ContractSpecificRoleName.WHITELISTED_ROLE:
        return protocolAccessManagerContract.revokeWhitelistedRole({
          account: params.targetAddress,
          fleetCommanderAddress: params.contractAddress,
        })
      default:
        // If the role is unknown, throw an error
        throw new Error(`Revoke method not implemented for role: ${params.role}`)
    }
  }
}
