import { IBlockchainClient } from '@summerfi/blockchain-client-common'
import { IProtocolAccessManagerWhiteListContract } from '@summerfi/contracts-provider-common'
import { IAddress, IChainInfo } from '@summerfi/sdk-common'
import { ContractWrapper } from '../ContractWrapper'

import { ProtocolAccessManagerWhitelistAbi } from '@summerfi/armada-protocol-abis'

/**
 * @name ProtocolAccessManagerWhiteListContract
 * @description Implementation for the ProtocolAccessManagerWhiteList contract wrapper
 * @implements IProtocolAccessManagerWhiteListContract
 */
export class ProtocolAccessManagerWhiteListContract<
    const TClient extends IBlockchainClient,
    TAddress extends IAddress,
  >
  extends ContractWrapper<typeof ProtocolAccessManagerWhitelistAbi, TClient, TAddress>
  implements IProtocolAccessManagerWhiteListContract
{
  /** FACTORY METHOD */

  /**
   * Creates a new instance of the ProtocolAccessManagerWhiteListContract
   *
   * @see constructor
   */
  static async create<TClient extends IBlockchainClient, TAddress extends IAddress>(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
  }): Promise<ProtocolAccessManagerWhiteListContract<TClient, TAddress>> {
    return new ProtocolAccessManagerWhiteListContract(params)
  }

  /** CONSTRUCTOR */
  private constructor(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
  }) {
    super(params)
  }

  /** METHODS */

  /** @see IContractWrapper.getAbi */
  getAbi() {
    return ProtocolAccessManagerWhitelistAbi
  }

  /** READ METHODS */

  /** @see IProtocolAccessManagerWhiteListContract.hasRole */
  async hasRole(
    params: Parameters<IProtocolAccessManagerWhiteListContract['hasRole']>[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['hasRole']> {
    return this.contract.read.hasRole([params.role as `0x${string}`, params.account.value])
  }

  /** @see IProtocolAccessManagerWhiteListContract.generateRole */
  async generateRole(
    params: Parameters<IProtocolAccessManagerWhiteListContract['generateRole']>[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['generateRole']> {
    return this.contract.read.generateRole([params.roleName, params.roleTargetContract.value])
  }

  /** @see IProtocolAccessManagerWhiteListContract.guardianExpirations */
  async guardianExpirations(
    params: Parameters<IProtocolAccessManagerWhiteListContract['guardianExpirations']>[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['guardianExpirations']> {
    return this.contract.read.guardianExpirations([params.guardian.value])
  }

  /** @see IProtocolAccessManagerWhiteListContract.GOVERNOR_ROLE */
  async GOVERNOR_ROLE(): ReturnType<IProtocolAccessManagerWhiteListContract['GOVERNOR_ROLE']> {
    return this.contract.read.GOVERNOR_ROLE()
  }

  /** @see IProtocolAccessManagerWhiteListContract.SUPER_KEEPER_ROLE */
  async SUPER_KEEPER_ROLE(): ReturnType<
    IProtocolAccessManagerWhiteListContract['SUPER_KEEPER_ROLE']
  > {
    return this.contract.read.SUPER_KEEPER_ROLE()
  }

  /** @see IProtocolAccessManagerWhiteListContract.DECAY_CONTROLLER_ROLE */
  async DECAY_CONTROLLER_ROLE(): ReturnType<
    IProtocolAccessManagerWhiteListContract['DECAY_CONTROLLER_ROLE']
  > {
    return this.contract.read.DECAY_CONTROLLER_ROLE()
  }

  /** @see IProtocolAccessManagerWhiteListContract.ADMIRALS_QUARTERS_ROLE */
  async ADMIRALS_QUARTERS_ROLE(): ReturnType<
    IProtocolAccessManagerWhiteListContract['ADMIRALS_QUARTERS_ROLE']
  > {
    return this.contract.read.ADMIRALS_QUARTERS_ROLE()
  }

  /** WRITE METHODS */

  /** @see IProtocolAccessManagerWhiteListContract.grantGovernorRole */
  async grantGovernorRole(
    params: Parameters<IProtocolAccessManagerWhiteListContract['grantGovernorRole']>[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['grantGovernorRole']> {
    return this._createTransaction({
      functionName: 'grantGovernorRole',
      args: [params.account.value],
      description: `Grant Governor role to ${params.account.value}`,
    })
  }

  /** @see IProtocolAccessManagerWhiteListContract.revokeGovernorRole */
  async revokeGovernorRole(
    params: Parameters<IProtocolAccessManagerWhiteListContract['revokeGovernorRole']>[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['revokeGovernorRole']> {
    return this._createTransaction({
      functionName: 'revokeGovernorRole',
      args: [params.account.value],
      description: `Revoke Governor role from ${params.account.value}`,
    })
  }

  /** @see IProtocolAccessManagerWhiteListContract.grantSuperKeeperRole */
  async grantSuperKeeperRole(
    params: Parameters<IProtocolAccessManagerWhiteListContract['grantSuperKeeperRole']>[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['grantSuperKeeperRole']> {
    return this._createTransaction({
      functionName: 'grantSuperKeeperRole',
      args: [params.account.value],
      description: `Grant Super Keeper role to ${params.account.value}`,
    })
  }

  /** @see IProtocolAccessManagerWhiteListContract.revokeSuperKeeperRole */
  async revokeSuperKeeperRole(
    params: Parameters<IProtocolAccessManagerWhiteListContract['revokeSuperKeeperRole']>[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['revokeSuperKeeperRole']> {
    return this._createTransaction({
      functionName: 'revokeSuperKeeperRole',
      args: [params.account.value],
      description: `Revoke Super Keeper role from ${params.account.value}`,
    })
  }

  /** @see IProtocolAccessManagerWhiteListContract.grantCuratorRole */
  async grantCuratorRole(
    params: Parameters<IProtocolAccessManagerWhiteListContract['grantCuratorRole']>[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['grantCuratorRole']> {
    return this._createTransaction({
      functionName: 'grantCuratorRole',
      args: [params.fleetCommanderAddress.value, params.account.value],
      description: `Grant Curator role to ${params.account.value} for FleetCommander ${params.fleetCommanderAddress.value}`,
    })
  }

  /** @see IProtocolAccessManagerWhiteListContract.revokeCuratorRole */
  async revokeCuratorRole(
    params: Parameters<IProtocolAccessManagerWhiteListContract['revokeCuratorRole']>[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['revokeCuratorRole']> {
    return this._createTransaction({
      functionName: 'revokeCuratorRole',
      args: [params.fleetCommanderAddress.value, params.account.value],
      description: `Revoke Curator role from ${params.account.value} for FleetCommander ${params.fleetCommanderAddress.value}`,
    })
  }

  /** @see IProtocolAccessManagerWhiteListContract.grantKeeperRole */
  async grantKeeperRole(
    params: Parameters<IProtocolAccessManagerWhiteListContract['grantKeeperRole']>[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['grantKeeperRole']> {
    return this._createTransaction({
      functionName: 'grantKeeperRole',
      args: [params.fleetCommanderAddress.value, params.account.value],
      description: `Grant Keeper role to ${params.account.value} for FleetCommander ${params.fleetCommanderAddress.value}`,
    })
  }

  /** @see IProtocolAccessManagerWhiteListContract.revokeKeeperRole */
  async revokeKeeperRole(
    params: Parameters<IProtocolAccessManagerWhiteListContract['revokeKeeperRole']>[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['revokeKeeperRole']> {
    return this._createTransaction({
      functionName: 'revokeKeeperRole',
      args: [params.fleetCommanderAddress.value, params.account.value],
      description: `Revoke Keeper role from ${params.account.value} for FleetCommander ${params.fleetCommanderAddress.value}`,
    })
  }

  /** @see IProtocolAccessManagerWhiteListContract.grantCommanderRole */
  async grantCommanderRole(
    params: Parameters<IProtocolAccessManagerWhiteListContract['grantCommanderRole']>[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['grantCommanderRole']> {
    return this._createTransaction({
      functionName: 'grantCommanderRole',
      args: [params.fleetCommanderAddress.value, params.account.value],
      description: `Grant Commander role to ${params.account.value} for FleetCommander ${params.fleetCommanderAddress.value}`,
    })
  }

  /** @see IProtocolAccessManagerWhiteListContract.revokeCommanderRole */
  async revokeCommanderRole(
    params: Parameters<IProtocolAccessManagerWhiteListContract['revokeCommanderRole']>[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['revokeCommanderRole']> {
    return this._createTransaction({
      functionName: 'revokeCommanderRole',
      args: [params.fleetCommanderAddress.value, params.account.value],
      description: `Revoke Commander role from ${params.account.value} for FleetCommander ${params.fleetCommanderAddress.value}`,
    })
  }

  /** @see IProtocolAccessManagerWhiteListContract.grantDecayControllerRole */
  async grantDecayControllerRole(
    params: Parameters<IProtocolAccessManagerWhiteListContract['grantDecayControllerRole']>[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['grantDecayControllerRole']> {
    return this._createTransaction({
      functionName: 'grantDecayControllerRole',
      args: [params.account.value],
      description: `Grant Decay Controller role to ${params.account.value}`,
    })
  }

  /** @see IProtocolAccessManagerWhiteListContract.revokeDecayControllerRole */
  async revokeDecayControllerRole(
    params: Parameters<IProtocolAccessManagerWhiteListContract['revokeDecayControllerRole']>[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['revokeDecayControllerRole']> {
    return this._createTransaction({
      functionName: 'revokeDecayControllerRole',
      args: [params.account.value],
      description: `Revoke Decay Controller role from ${params.account.value}`,
    })
  }

  /** @see IProtocolAccessManagerWhiteListContract.grantAdmiralsQuartersRole */
  async grantAdmiralsQuartersRole(
    params: Parameters<IProtocolAccessManagerWhiteListContract['grantAdmiralsQuartersRole']>[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['grantAdmiralsQuartersRole']> {
    return this._createTransaction({
      functionName: 'grantAdmiralsQuartersRole',
      args: [params.account.value],
      description: `Grant Admirals Quarters role to ${params.account.value}`,
    })
  }

  /** @see IProtocolAccessManagerWhiteListContract.revokeAdmiralsQuartersRole */
  async revokeAdmiralsQuartersRole(
    params: Parameters<IProtocolAccessManagerWhiteListContract['revokeAdmiralsQuartersRole']>[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['revokeAdmiralsQuartersRole']> {
    return this._createTransaction({
      functionName: 'revokeAdmiralsQuartersRole',
      args: [params.account.value],
      description: `Revoke Admirals Quarters role from ${params.account.value}`,
    })
  }

  /** @see IProtocolAccessManagerWhiteListContract.selfRevokeContractSpecificRole */
  async selfRevokeContractSpecificRole(
    params: Parameters<
      IProtocolAccessManagerWhiteListContract['selfRevokeContractSpecificRole']
    >[0],
  ): ReturnType<IProtocolAccessManagerWhiteListContract['selfRevokeContractSpecificRole']> {
    return this._createTransaction({
      functionName: 'selfRevokeContractSpecificRole',
      args: [params.roleName, params.roleTargetContract.value],
      description: `Self-revoke contract-specific role ${params.roleName} for contract ${params.roleTargetContract.value}`,
    })
  }
}
