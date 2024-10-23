import { IArmadaVaultId, IRebalanceData } from '@summerfi/armada-protocol-common'
import { IAddress, IPercentage, ITokenAmount, TransactionInfo } from '@summerfi/sdk-common'
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
  async setFleetDepositCap(params: {
    poolId: IArmadaVaultId
    cap: ITokenAmount
  }): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.setFleetDepositCap.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.setTipJar */
  async setTipJar(params: { poolId: IArmadaVaultId }): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.setTipJar.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.setTipRate */
  async setTipRate(params: {
    poolId: IArmadaVaultId
    rate: IPercentage
  }): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.setTipRate.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.addArk */
  async addArk(params: { poolId: IArmadaVaultId; ark: IAddress }): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.addArk.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.addArks */
  async addArks(params: { poolId: IArmadaVaultId; arks: IAddress[] }): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.addArks.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.removeArk */
  async removeArk(params: { poolId: IArmadaVaultId; ark: IAddress }): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.removeArk.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.setArkDepositCap */
  async setArkDepositCap(params: {
    poolId: IArmadaVaultId
    ark: IAddress
    cap: ITokenAmount
  }): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.setArkDepositCap.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.setArkMaxRebalanceOutflow */
  async setArkMaxRebalanceOutflow(params: {
    poolId: IArmadaVaultId
    ark: IAddress
    maxRebalanceOutflow: ITokenAmount
  }): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.setArkMaxRebalanceOutflow.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.setArkMaxRebalanceInflow */
  async setArkMaxRebalanceInflow(params: {
    poolId: IArmadaVaultId
    ark: IAddress
    maxRebalanceInflow: ITokenAmount
  }): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.setArkMaxRebalanceInflow.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.setMinimumBufferBalance */
  async setMinimumBufferBalance(params: {
    poolId: IArmadaVaultId
    minimumBufferBalance: ITokenAmount
  }): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.setMinimumBufferBalance.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.updateRebalanceCooldown */
  async updateRebalanceCooldown(params: {
    poolId: IArmadaVaultId
    cooldown: number
  }): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.updateRebalanceCooldown.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.emergencyShutdown */
  forceRebalance(params: {
    poolId: IArmadaVaultId
    rebalanceData: IRebalanceData[]
  }): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.forceRebalance.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.emergencyShutdown */
  emergencyShutdown(params: { poolId: IArmadaVaultId }): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.emergencyShutdown.query(params)
  }
}
