import { TransactionInfo } from '@summerfi/sdk-common'
import { IArmadaManagerGovernanceClient } from '../../interfaces/ArmadaManager/IArmadaManagerGovernanceClient'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { RPCMainClientType } from '../../rpc/SDKMainClient'

/**
 * @name ArmadaManagerGovernanceClient
 * @description Implementation of the Armada Manager Keepers client interface for Users of the Armada
 */
export class ArmadaManagerGovernanceClient
  extends IRPCClient
  implements IArmadaManagerGovernanceClient
{
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see IArmadaManagerGovernanceClient.setFleetDepositCap */
  async setFleetDepositCap(
    params: Parameters<IArmadaManagerGovernanceClient['setFleetDepositCap']>[0],
  ): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.setFleetDepositCap.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.setTipJar */
  async setTipJar(
    params: Parameters<IArmadaManagerGovernanceClient['setTipJar']>[0],
  ): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.setTipJar.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.setTipRate */
  async setTipRate(
    params: Parameters<IArmadaManagerGovernanceClient['setTipRate']>[0],
  ): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.setTipRate.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.addArk */
  async addArk(
    params: Parameters<IArmadaManagerGovernanceClient['addArk']>[0],
  ): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.addArk.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.addArks */
  async addArks(
    params: Parameters<IArmadaManagerGovernanceClient['addArks']>[0],
  ): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.addArks.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.removeArk */
  async removeArk(
    params: Parameters<IArmadaManagerGovernanceClient['removeArk']>[0],
  ): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.removeArk.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.setArkDepositCap */
  async setArkDepositCap(
    params: Parameters<IArmadaManagerGovernanceClient['setArkDepositCap']>[0],
  ): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.setArkDepositCap.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.setArkMaxRebalanceOutflow */
  async setArkMaxRebalanceOutflow(
    params: Parameters<IArmadaManagerGovernanceClient['setArkMaxRebalanceOutflow']>[0],
  ): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.setArkMaxRebalanceOutflow.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.setArkMaxRebalanceInflow */
  async setArkMaxRebalanceInflow(
    params: Parameters<IArmadaManagerGovernanceClient['setArkMaxRebalanceInflow']>[0],
  ): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.setArkMaxRebalanceInflow.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.setMinimumBufferBalance */
  async setMinimumBufferBalance(
    params: Parameters<IArmadaManagerGovernanceClient['setMinimumBufferBalance']>[0],
  ): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.setMinimumBufferBalance.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.updateRebalanceCooldown */
  async updateRebalanceCooldown(
    params: Parameters<IArmadaManagerGovernanceClient['updateRebalanceCooldown']>[0],
  ): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.updateRebalanceCooldown.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.emergencyShutdown */
  forceRebalance(
    params: Parameters<IArmadaManagerGovernanceClient['forceRebalance']>[0],
  ): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.forceRebalance.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.emergencyShutdown */
  emergencyShutdown(
    params: Parameters<IArmadaManagerGovernanceClient['emergencyShutdown']>[0],
  ): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.emergencyShutdown.query(params)
  }
}
