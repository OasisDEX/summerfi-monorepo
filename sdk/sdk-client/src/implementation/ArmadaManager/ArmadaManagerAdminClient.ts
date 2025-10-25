import { IArmadaManagerAdminClient } from '../../interfaces/ArmadaManager/IArmadaManagerAdminClient'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { RPCMainClientType } from '../../rpc/SDKMainClient'

/**
 * @name ArmadaManagerAdminClient
 * @description Implementation of the Armada Manager Admin client interface for administrative operations
 */
export class ArmadaManagerAdminClient extends IRPCClient implements IArmadaManagerAdminClient {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see IArmadaManagerAdminClient.rebalance */
  async rebalance(
    params: Parameters<IArmadaManagerAdminClient['rebalance']>[0],
  ): ReturnType<IArmadaManagerAdminClient['rebalance']> {
    return this.rpcClient.armada.admin.rebalance.query(params)
  }

  /** @see IArmadaManagerAdminClient.adjustBuffer */
  async adjustBuffer(
    params: Parameters<IArmadaManagerAdminClient['adjustBuffer']>[0],
  ): ReturnType<IArmadaManagerAdminClient['adjustBuffer']> {
    return this.rpcClient.armada.admin.adjustBuffer.query(params)
  }

  /** @see IArmadaManagerAdminClient.setFleetDepositCap */
  async setFleetDepositCap(
    params: Parameters<IArmadaManagerAdminClient['setFleetDepositCap']>[0],
  ): ReturnType<IArmadaManagerAdminClient['setFleetDepositCap']> {
    return this.rpcClient.armada.admin.setFleetDepositCap.query(params)
  }

  /** @see IArmadaManagerAdminClient.setTipJar */
  async setTipJar(
    params: Parameters<IArmadaManagerAdminClient['setTipJar']>[0],
  ): ReturnType<IArmadaManagerAdminClient['setTipJar']> {
    return this.rpcClient.armada.admin.setTipJar.query(params)
  }

  /** @see IArmadaManagerAdminClient.setTipRate */
  async setTipRate(
    params: Parameters<IArmadaManagerAdminClient['setTipRate']>[0],
  ): ReturnType<IArmadaManagerAdminClient['setTipRate']> {
    return this.rpcClient.armada.admin.setTipRate.query(params)
  }

  /** @see IArmadaManagerAdminClient.addArk */
  async addArk(
    params: Parameters<IArmadaManagerAdminClient['addArk']>[0],
  ): ReturnType<IArmadaManagerAdminClient['addArk']> {
    return this.rpcClient.armada.admin.addArk.query(params)
  }

  /** @see IArmadaManagerAdminClient.addArks */
  async addArks(
    params: Parameters<IArmadaManagerAdminClient['addArks']>[0],
  ): ReturnType<IArmadaManagerAdminClient['addArks']> {
    return this.rpcClient.armada.admin.addArks.query(params)
  }

  /** @see IArmadaManagerAdminClient.removeArk */
  async removeArk(
    params: Parameters<IArmadaManagerAdminClient['removeArk']>[0],
  ): ReturnType<IArmadaManagerAdminClient['removeArk']> {
    return this.rpcClient.armada.admin.removeArk.query(params)
  }

  /** @see IArmadaManagerAdminClient.setArkDepositCap */
  async setArkDepositCap(
    params: Parameters<IArmadaManagerAdminClient['setArkDepositCap']>[0],
  ): ReturnType<IArmadaManagerAdminClient['setArkDepositCap']> {
    return this.rpcClient.armada.admin.setArkDepositCap.query(params)
  }

  /** @see IArmadaManagerAdminClient.setArkMaxRebalanceOutflow */
  async setArkMaxRebalanceOutflow(
    params: Parameters<IArmadaManagerAdminClient['setArkMaxRebalanceOutflow']>[0],
  ): ReturnType<IArmadaManagerAdminClient['setArkMaxRebalanceOutflow']> {
    return this.rpcClient.armada.admin.setArkMaxRebalanceOutflow.query(params)
  }

  /** @see IArmadaManagerAdminClient.setArkMaxRebalanceInflow */
  async setArkMaxRebalanceInflow(
    params: Parameters<IArmadaManagerAdminClient['setArkMaxRebalanceInflow']>[0],
  ): ReturnType<IArmadaManagerAdminClient['setArkMaxRebalanceInflow']> {
    return this.rpcClient.armada.admin.setArkMaxRebalanceInflow.query(params)
  }

  /** @see IArmadaManagerAdminClient.setMinimumBufferBalance */
  async setMinimumBufferBalance(
    params: Parameters<IArmadaManagerAdminClient['setMinimumBufferBalance']>[0],
  ): ReturnType<IArmadaManagerAdminClient['setMinimumBufferBalance']> {
    return this.rpcClient.armada.admin.setMinimumBufferBalance.query(params)
  }

  /** @see IArmadaManagerAdminClient.updateRebalanceCooldown */
  async updateRebalanceCooldown(
    params: Parameters<IArmadaManagerAdminClient['updateRebalanceCooldown']>[0],
  ): ReturnType<IArmadaManagerAdminClient['updateRebalanceCooldown']> {
    return this.rpcClient.armada.admin.updateRebalanceCooldown.query(params)
  }

  /** @see IArmadaManagerAdminClient.forceRebalance */
  async forceRebalance(
    params: Parameters<IArmadaManagerAdminClient['forceRebalance']>[0],
  ): ReturnType<IArmadaManagerAdminClient['forceRebalance']> {
    return this.rpcClient.armada.admin.forceRebalance.query(params)
  }

  /** @see IArmadaManagerAdminClient.emergencyShutdown */
  async emergencyShutdown(
    params: Parameters<IArmadaManagerAdminClient['emergencyShutdown']>[0],
  ): ReturnType<IArmadaManagerAdminClient['emergencyShutdown']> {
    return this.rpcClient.armada.admin.emergencyShutdown.query(params)
  }

  /** @see IArmadaManagerAdminClient.arks */
  async arks(
    params: Parameters<IArmadaManagerAdminClient['arks']>[0],
  ): ReturnType<IArmadaManagerAdminClient['arks']> {
    return this.rpcClient.armada.admin.arks.query(params)
  }

  /** @see IArmadaManagerAdminClient.arkConfig */
  async arkConfig(
    params: Parameters<IArmadaManagerAdminClient['arkConfig']>[0],
  ): ReturnType<IArmadaManagerAdminClient['arkConfig']> {
    return this.rpcClient.armada.admin.arkConfig.query(params)
  }

  /** @see IArmadaManagerAdminClient.getFeeRevenueConfig */
  async getFeeRevenueConfig(
    params: Parameters<IArmadaManagerAdminClient['getFeeRevenueConfig']>[0],
  ): ReturnType<IArmadaManagerAdminClient['getFeeRevenueConfig']> {
    return this.rpcClient.armada.admin.getFeeRevenueConfig.query(params)
  }
}
