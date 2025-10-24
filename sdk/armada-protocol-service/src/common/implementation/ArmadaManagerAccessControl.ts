import type { IArmadaManagerAccessControl } from '@summerfi/armada-protocol-common'
import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'
import {
  IAddress,
  getChainInfoByChainId,
  type HexData,
  type ChainInfo,
  type ChainId,
  type AddressValue,
  Address,
  LoggingService,
  GlobalRoles,
  GLOBAL_ROLE_HASHES,
  ContractSpecificRoleName,
} from '@summerfi/sdk-common'

import type { IDeploymentProvider } from '../../deployment-provider/IDeploymentProvider'
import { AccessControlAbi } from './abi'
import { AccessControlStartBlockConfig } from './configs/AccessControlStartBlockConfig'

/**
 * @name ArmadaManagerAccessControl
 * @description Implementation of the IArmadaManagerAccessControl interface. Handles role-based access control operations for Armada Protocol
 */
export class ArmadaManagerAccessControl implements IArmadaManagerAccessControl {
  private _configProvider: IConfigurationProvider
  private _contractsProvider: IContractsProvider
  private _blockchainClientProvider: IBlockchainClientProvider
  private _deploymentProvider: IDeploymentProvider
  private _subgraphManager: IArmadaSubgraphManager
  private _clientId?: string
  private _roleHashes: Record<GlobalRoles, HexData | null> = { ...GLOBAL_ROLE_HASHES }

  /**
   * @description Block numbers from which to start fetching events for each chain
   * This avoids scanning from genesis block for performance
   * Values are loaded from configuration file for flexibility
   */
  private readonly _startBlocks: Partial<Record<ChainId, bigint>> = AccessControlStartBlockConfig

  /** CONSTRUCTOR */
  constructor(params: {
    configProvider: IConfigurationProvider
    contractsProvider: IContractsProvider
    blockchainClientProvider: IBlockchainClientProvider
    deploymentProvider: IDeploymentProvider
    subgraphManager: IArmadaSubgraphManager
    clientId?: string
  }) {
    this._configProvider = params.configProvider
    this._contractsProvider = params.contractsProvider
    this._blockchainClientProvider = params.blockchainClientProvider
    this._deploymentProvider = params.deploymentProvider
    this._subgraphManager = params.subgraphManager
    this._clientId = params.clientId
  }

  /** PRIVATE METHODS **/

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
   * @description Gets the starting block for event fetching for a given chain
   * Throws an error if the chain is not configured to prevent scanning from genesis
   */
  private _getStartBlockForEvents(chainId: ChainId): bigint {
    const startBlock = this._startBlocks[chainId]
    if (startBlock === undefined) {
      throw new Error(
        `Start block not configured for chain ${chainId}. Add configuration to prevent scanning from genesis block.`,
      )
    }
    return startBlock
  }

  /**
   * @description Gets the global role hash for a given role
   * This method caches the role hashes to avoid redundant contract calls
   */
  private async _getGlobalRoleHash(chainId: ChainId, role: GlobalRoles): Promise<HexData> {
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
      case GlobalRoles.GOVERNOR_ROLE:
        roleHash = await protocolAccessManagerContract.GOVERNOR_ROLE()
        break
      case GlobalRoles.SUPER_KEEPER_ROLE:
        roleHash = await protocolAccessManagerContract.SUPER_KEEPER_ROLE()
        break
      case GlobalRoles.DECAY_CONTROLLER_ROLE:
        roleHash = await protocolAccessManagerContract.DECAY_CONTROLLER_ROLE()
        break
      case GlobalRoles.ADMIRALS_QUARTERS_ROLE:
        roleHash = await protocolAccessManagerContract.ADMIRALS_QUARTERS_ROLE()
        break
      default:
        throw new Error(`Unsupported global role: ${role}`)
    }

    // Cache the result
    this._roleHashes[role] = roleHash
    return roleHash
  }

  /**
   * @description Processes RoleGranted and RoleRevoked events to determine current role holders by latest state
   * @param grantedEvents Array of RoleGranted event logs
   * @param revokedEvents Array of RoleRevoked event logs
   * @returns Array of addresses that currently have the role
   */
  private _processRoleEvents(
    grantedEvents: Array<{
      args: { account?: `0x${string}` }
      blockNumber?: bigint
      transactionIndex?: number
      logIndex?: number
    }>,
    revokedEvents: Array<{
      args: { account?: `0x${string}` }
      blockNumber?: bigint
      transactionIndex?: number
      logIndex?: number
    }>,
  ): AddressValue[] {
    // Combine all events and sort by block number, transaction index, and log index to get chronological order
    const allEvents = [
      ...grantedEvents.map((event) => ({ ...event, type: 'granted' as const })),
      ...revokedEvents.map((event) => ({ ...event, type: 'revoked' as const })),
    ].sort((a, b) => {
      // First sort by block number
      if (a.blockNumber !== b.blockNumber) {
        return Number((a.blockNumber || 0n) - (b.blockNumber || 0n))
      }
      // Then by transaction index
      if (a.transactionIndex !== b.transactionIndex) {
        return (a.transactionIndex || 0) - (b.transactionIndex || 0)
      }
      // Finally by log index
      return (a.logIndex || 0) - (b.logIndex || 0)
    })
    LoggingService.debug(`Processing ${allEvents.length} role events for final state determination`)

    // Track the final state for each address
    const addressRoleState = new Map<string, boolean>()

    // Process events in chronological order to determine final state
    allEvents.forEach((event) => {
      const address = event.args.account
      if (address) {
        addressRoleState.set(address, event.type === 'granted')
      }
    })
    LoggingService.debug(`Final role state determined for ${addressRoleState.size} addresses`, {
      addressRoleState,
    })

    // Return only addresses that currently have the role
    return Array.from(addressRoleState.entries())
      .filter(([_, hasRole]) => hasRole)
      .map(([address, _]) => Address.createFromEthereum({ value: address }).value)
  }

  /** METHODS */

  /** @see IArmadaManagerAccessControl.hasGlobalRole */
  hasGlobalRole: IArmadaManagerAccessControl['hasGlobalRole'] = async (params) => {
    const roleHash = await this._getGlobalRoleHash(params.chainId, params.role)

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
  hasContractSpecificRole: IArmadaManagerAccessControl['hasContractSpecificRole'] = async (
    params,
  ) => {
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

  /** @see IArmadaManagerAccessControl.grantGlobalRole */
  grantGlobalRole: IArmadaManagerAccessControl['grantGlobalRole'] = async (params) => {
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
      case GlobalRoles.GOVERNOR_ROLE:
        return protocolAccessManagerContract.grantGovernorRole({
          account: params.targetAddress,
        })
      case GlobalRoles.SUPER_KEEPER_ROLE:
        return protocolAccessManagerContract.grantSuperKeeperRole({
          account: params.targetAddress,
        })
      case GlobalRoles.DECAY_CONTROLLER_ROLE:
        return protocolAccessManagerContract.grantDecayControllerRole({
          account: params.targetAddress,
        })
      case GlobalRoles.ADMIRALS_QUARTERS_ROLE:
        return protocolAccessManagerContract.grantAdmiralsQuartersRole({
          account: params.targetAddress,
        })
      default:
        throw new Error(`Grant method not implemented for role: ${params.role}`)
    }
  }

  /** @see IArmadaManagerAccessControl.revokeGlobalRole */
  revokeGlobalRole: IArmadaManagerAccessControl['revokeGlobalRole'] = async (params) => {
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
      case GlobalRoles.GOVERNOR_ROLE:
        return protocolAccessManagerContract.revokeGovernorRole({
          account: params.targetAddress,
        })
      case GlobalRoles.SUPER_KEEPER_ROLE:
        return protocolAccessManagerContract.revokeSuperKeeperRole({
          account: params.targetAddress,
        })
      case GlobalRoles.DECAY_CONTROLLER_ROLE:
        return protocolAccessManagerContract.revokeDecayControllerRole({
          account: params.targetAddress,
        })
      case GlobalRoles.ADMIRALS_QUARTERS_ROLE:
        return protocolAccessManagerContract.revokeAdmiralsQuartersRole({
          account: params.targetAddress,
        })
      default:
        throw new Error(`Revoke method not implemented for role: ${params.role}`)
    }
  }

  /** @see IArmadaManagerAccessControl.grantContractSpecificRole */
  grantContractSpecificRole: IArmadaManagerAccessControl['grantContractSpecificRole'] = async (
    params,
  ) => {
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
        return protocolAccessManagerContract.grantKeeperRole({
          account: params.targetAddress,
          fleetCommanderAddress: params.contractAddress,
        })
      case ContractSpecificRoleName.COMMANDER_ROLE:
        return protocolAccessManagerContract.grantCommanderRole({
          account: params.targetAddress,
          fleetCommanderAddress: params.contractAddress,
        })
      case ContractSpecificRoleName.CURATOR_ROLE:
        return protocolAccessManagerContract.grantCuratorRole({
          account: params.targetAddress,
          fleetCommanderAddress: params.contractAddress,
        })
      default:
        // If the role is unknown, throw an error
        throw new Error(`Grant method not implemented for role: ${params.role}`)
    }
  }

  /** @see IArmadaManagerAccessControl.revokeContractSpecificRole */
  revokeContractSpecificRole: IArmadaManagerAccessControl['revokeContractSpecificRole'] = async (
    params,
  ) => {
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
          fleetCommanderAddress: params.contractAddress,
        })
      case ContractSpecificRoleName.CURATOR_ROLE:
        return protocolAccessManagerContract.revokeCuratorRole({
          account: params.targetAddress,
          fleetCommanderAddress: params.contractAddress,
        })
      default:
        // If the role is unknown, throw an error
        throw new Error(`Revoke method not implemented for role: ${params.role}`)
    }
  }

  /** @see IArmadaManagerAccessControl.getAllAddressesWithGlobalRole */
  getAllAddressesWithGlobalRole: IArmadaManagerAccessControl['getAllAddressesWithGlobalRole'] =
    async (params) => {
      // Get the chain info from the provided chainId
      const chainInfo = getChainInfoByChainId(Number(params.chainId))

      // Get the blockchain client
      const client = this._blockchainClientProvider.getBlockchainClient({
        chainInfo: chainInfo,
      })

      // Get the protocol access manager contract address
      const contractAddress = this._getProtocolAccessManagerAddress(chainInfo)

      // Get the role hash for the global role
      const roleHash = await this._getGlobalRoleHash(params.chainId, params.role)

      // Get the starting block for this chain, throws if not configured
      const fromBlock = this._getStartBlockForEvents(params.chainId)

      // Fetch RoleGranted and RoleRevoked events for this specific role in parallel
      const [roleGrantedLogs, roleRevokedLogs] = await Promise.all([
        client.getLogs({
          address: contractAddress.value,
          event: AccessControlAbi.RoleGranted,
          args: {
            role: roleHash,
          },
          fromBlock,
          toBlock: 'latest',
        }),
        client.getLogs({
          address: contractAddress.value,
          event: AccessControlAbi.RoleRevoked,
          args: {
            role: roleHash,
          },
          fromBlock,
          toBlock: 'latest',
        }),
      ])

      // Process events to determine current role holders
      return this._processRoleEvents(roleGrantedLogs, roleRevokedLogs)
    }

  /** @see IArmadaManagerAccessControl.getAllAddressesWithContractSpecificRole */
  getAllAddressesWithContractSpecificRole: IArmadaManagerAccessControl['getAllAddressesWithContractSpecificRole'] =
    async (params) => {
      // Get the chain info from the provided chainId
      const chainInfo = getChainInfoByChainId(Number(params.chainId))

      // Get the blockchain client
      const client = this._blockchainClientProvider.getBlockchainClient({
        chainInfo: chainInfo,
      })

      // Get the protocol access manager contract address
      const protocolAccessManagerAddress = this._getProtocolAccessManagerAddress(chainInfo)

      // Get the protocol access manager contract to generate the role hash
      const protocolAccessManagerContract =
        await this._contractsProvider.getProtocolAccessManagerWhiteListContract({
          chainInfo: chainInfo,
          address: protocolAccessManagerAddress,
        })

      // Generate the role hash for the contract-specific role
      const roleHash = await protocolAccessManagerContract.generateRole({
        roleName: params.role,
        roleTargetContract: params.contractAddress,
      })

      // Get the starting block for this chain, throws if not configured
      const fromBlock = this._getStartBlockForEvents(params.chainId)

      // Fetch RoleGranted and RoleRevoked events for this specific role in parallel
      const [roleGrantedLogs, roleRevokedLogs] = await Promise.all([
        client.getLogs({
          address: protocolAccessManagerAddress.value,
          event: AccessControlAbi.RoleGranted,
          args: {
            role: roleHash,
          },
          fromBlock,
          toBlock: 'latest',
        }),
        client.getLogs({
          address: protocolAccessManagerAddress.value,
          event: AccessControlAbi.RoleRevoked,
          args: {
            role: roleHash,
          },
          fromBlock,
          toBlock: 'latest',
        }),
      ])

      // Process events to determine current role holders
      return this._processRoleEvents(roleGrantedLogs, roleRevokedLogs)
    }

  /** @see IArmadaManagerAccessControl.isWhitelisted */
  isWhitelisted: IArmadaManagerAccessControl['isWhitelisted'] = async (params) => {
    // Get the chain info from the provided chainId
    const chainInfo = getChainInfoByChainId(Number(params.chainId))

    // Get the FleetCommander contract
    const fleetCommanderContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: chainInfo,
      address: Address.createFromEthereum({ value: params.fleetCommanderAddress }),
    })

    return fleetCommanderContract.isWhitelisted({
      account: Address.createFromEthereum({ value: params.account }),
    })
  }

  /** @see IArmadaManagerAccessControl.setWhitelisted */
  setWhitelisted: IArmadaManagerAccessControl['setWhitelisted'] = async (params) => {
    // Get the chain info from the provided chainId
    const chainInfo = getChainInfoByChainId(Number(params.chainId))

    // Get the FleetCommander contract
    const fleetCommanderContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: chainInfo,
      address: Address.createFromEthereum({ value: params.fleetCommanderAddress }),
    })

    return fleetCommanderContract.setWhitelisted({
      account: Address.createFromEthereum({ value: params.account }),
      allowed: params.allowed,
    })
  }

  /** @see IArmadaManagerAccessControl.setWhitelistedBatch */
  setWhitelistedBatch: IArmadaManagerAccessControl['setWhitelistedBatch'] = async (params) => {
    // Get the chain info from the provided chainId
    const chainInfo = getChainInfoByChainId(Number(params.chainId))

    // Get the FleetCommander contract
    const fleetCommanderContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: chainInfo,
      address: Address.createFromEthereum({ value: params.fleetCommanderAddress }),
    })

    return fleetCommanderContract.setWhitelistedBatch({
      accounts: params.accounts.map((account) => Address.createFromEthereum({ value: account })),
      allowed: params.allowed,
    })
  }

  /** @see IArmadaManagerAccessControl.getAllRoles */
  getAllRoles: IArmadaManagerAccessControl['getAllRoles'] = async (params) => {
    try {
      if (!this._clientId) {
        throw new Error('Client ID is not set for ArmadaManagerAccessControl')
      }
      const result = await this._subgraphManager.getAllRoles({
        chainId: params.chainId,
        institutionId: this._clientId,
        first: params.first ?? 1000,
        skip: params.skip ?? 0,
        name: params.name,
        targetContract: params.targetContract,
        owner: params.owner,
      })

      return result
    } catch (error) {
      LoggingService.error('Error fetching roles from subgraph:', error)
      throw new Error(
        `Failed to get roles: ${(error as { message: string } | undefined)?.message ?? error}`,
      )
    }
  }
}
