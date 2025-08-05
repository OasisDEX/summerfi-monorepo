import type { IArmadaManagerAdmin } from '@summerfi/armada-protocol-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'

/**
 * @name ArmadaManagerAdmin
 * @description This class is the implementation of the IArmadaManagerAdmin interface. Handles administrative operations for Armada Protocol
 */
export class ArmadaManagerAdmin implements IArmadaManagerAdmin {
  private _configProvider: IConfigurationProvider
  private _contractsProvider: IContractsProvider
  private _blockchainClientProvider: IBlockchainClientProvider

  /** CONSTRUCTOR */
  constructor(params: {
    configProvider: IConfigurationProvider
    contractsProvider: IContractsProvider
    blockchainClientProvider: IBlockchainClientProvider
  }) {
    this._configProvider = params.configProvider
    this._contractsProvider = params.contractsProvider
    this._blockchainClientProvider = params.blockchainClientProvider
  }

  /** @see IArmadaManagerAdmin.rebalance */
  async rebalance(
    params: Parameters<IArmadaManagerAdmin['rebalance']>[0],
  ): ReturnType<IArmadaManagerAdmin['rebalance']> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.rebalance({ rebalanceData: params.rebalanceData })
  }

  /** @see IArmadaManagerAdmin.adjustBuffer */
  async adjustBuffer(
    params: Parameters<IArmadaManagerAdmin['adjustBuffer']>[0],
  ): ReturnType<IArmadaManagerAdmin['adjustBuffer']> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.adjustBuffer({ rebalanceData: params.rebalanceData })
  }

  /** @see IArmadaManagerAdmin.setFleetDepositCap */
  async setFleetDepositCap(
    params: Parameters<IArmadaManagerAdmin['setFleetDepositCap']>[0],
  ): ReturnType<IArmadaManagerAdmin['setFleetDepositCap']> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setFleetDepositCap({ cap: params.cap })
  }

  /** @see IArmadaManagerAdmin.setTipJar */
  async setTipJar(
    params: Parameters<IArmadaManagerAdmin['setTipJar']>[0],
  ): ReturnType<IArmadaManagerAdmin['setTipJar']> {
    throw new Error(
      'setTipJar method is not implemented in ArmadaManagerAdmin' + JSON.stringify(params),
    )
  }

  /** @see IArmadaManagerAdmin.setTipRate */
  async setTipRate(
    params: Parameters<IArmadaManagerAdmin['setTipRate']>[0],
  ): ReturnType<IArmadaManagerAdmin['setTipRate']> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setTipRate({ rate: params.rate })
  }

  /** @see IArmadaManagerAdmin.addArk */
  async addArk(
    params: Parameters<IArmadaManagerAdmin['addArk']>[0],
  ): ReturnType<IArmadaManagerAdmin['addArk']> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.addArk({ ark: params.ark })
  }

  /** @see IArmadaManagerAdmin.addArks */
  async addArks(
    params: Parameters<IArmadaManagerAdmin['addArks']>[0],
  ): ReturnType<IArmadaManagerAdmin['addArks']> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.addArks({ arks: params.arks })
  }

  /** @see IArmadaManagerAdmin.removeArk */
  async removeArk(
    params: Parameters<IArmadaManagerAdmin['removeArk']>[0],
  ): ReturnType<IArmadaManagerAdmin['removeArk']> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.removeArk({ ark: params.ark })
  }

  /** @see IArmadaManagerAdmin.setArkDepositCap */
  async setArkDepositCap(
    params: Parameters<IArmadaManagerAdmin['setArkDepositCap']>[0],
  ): ReturnType<IArmadaManagerAdmin['setArkDepositCap']> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setArkDepositCap({ ark: params.ark, cap: params.cap })
  }

  /** @see IArmadaManagerAdmin.setArkMaxRebalanceOutflow */
  async setArkMaxRebalanceOutflow(
    params: Parameters<IArmadaManagerAdmin['setArkMaxRebalanceOutflow']>[0],
  ): ReturnType<IArmadaManagerAdmin['setArkMaxRebalanceOutflow']> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setArkMaxRebalanceOutflow({
      ark: params.ark,
      maxRebalanceOutflow: params.maxRebalanceOutflow,
    })
  }

  /** @see IArmadaManagerAdmin.setArkMaxRebalanceInflow */
  async setArkMaxRebalanceInflow(
    params: Parameters<IArmadaManagerAdmin['setArkMaxRebalanceInflow']>[0],
  ): ReturnType<IArmadaManagerAdmin['setArkMaxRebalanceInflow']> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setArkMaxRebalanceInflow({
      ark: params.ark,
      maxRebalanceInflow: params.maxRebalanceInflow,
    })
  }

  /** @see IArmadaManagerAdmin.setMinimumBufferBalance */
  async setMinimumBufferBalance(
    params: Parameters<IArmadaManagerAdmin['setMinimumBufferBalance']>[0],
  ): ReturnType<IArmadaManagerAdmin['setMinimumBufferBalance']> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setMinimumBufferBalance({
      minimumBufferBalance: params.minimumBufferBalance,
    })
  }

  /** @see IArmadaManagerAdmin.updateRebalanceCooldown */
  async updateRebalanceCooldown(
    params: Parameters<IArmadaManagerAdmin['updateRebalanceCooldown']>[0],
  ): ReturnType<IArmadaManagerAdmin['updateRebalanceCooldown']> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.updateRebalanceCooldown({ cooldown: params.cooldown })
  }

  /** @see IArmadaManagerAdmin.forceRebalance */
  async forceRebalance(
    params: Parameters<IArmadaManagerAdmin['forceRebalance']>[0],
  ): ReturnType<IArmadaManagerAdmin['forceRebalance']> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.forceRebalance({ rebalanceData: params.rebalanceData })
  }

  /** @see IArmadaManagerAdmin.emergencyShutdown */
  async emergencyShutdown(
    params: Parameters<IArmadaManagerAdmin['emergencyShutdown']>[0],
  ): ReturnType<IArmadaManagerAdmin['emergencyShutdown']> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.emergencyShutdown()
  }

  /** @see IArmadaManagerAdmin.arks */
  async arks(
    params: Parameters<IArmadaManagerAdmin['arks']>[0],
  ): ReturnType<IArmadaManagerAdmin['arks']> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })
    return fleetContract.arks()
  }
}
