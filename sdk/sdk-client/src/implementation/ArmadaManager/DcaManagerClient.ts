import { IDcaManagerClient } from '../../interfaces/ArmadaManager/IDcaManagerClient'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { RPCMainClientType } from '../../rpc/SDKMainClient'

/**
 * Implementation of the DCA manager client interface
 */
export class DcaManagerClient extends IRPCClient implements IDcaManagerClient {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see IDcaManagerClient.createStrategyTx */
  async createStrategyTx(
    params: Parameters<IDcaManagerClient['createStrategyTx']>[0],
  ): ReturnType<IDcaManagerClient['createStrategyTx']> {
    return this.rpcClient.armada.dca.createStrategyTx.query(params)
  }

  /** @see IDcaManagerClient.depositAndCreateStrategyTx */
  async depositAndCreateStrategyTx(
    params: Parameters<IDcaManagerClient['depositAndCreateStrategyTx']>[0],
  ): ReturnType<IDcaManagerClient['depositAndCreateStrategyTx']> {
    return this.rpcClient.armada.dca.depositAndCreateStrategyTx.query(params)
  }

  /** @see IDcaManagerClient.editStrategyTx */
  async editStrategyTx(
    params: Parameters<IDcaManagerClient['editStrategyTx']>[0],
  ): ReturnType<IDcaManagerClient['editStrategyTx']> {
    return this.rpcClient.armada.dca.editStrategyTx.query(params)
  }

  /** @see IDcaManagerClient.pauseStrategyTx */
  async pauseStrategyTx(
    params: Parameters<IDcaManagerClient['pauseStrategyTx']>[0],
  ): ReturnType<IDcaManagerClient['pauseStrategyTx']> {
    return this.rpcClient.armada.dca.pauseStrategyTx.query(params)
  }

  /** @see IDcaManagerClient.resumeStrategyTx */
  async resumeStrategyTx(
    params: Parameters<IDcaManagerClient['resumeStrategyTx']>[0],
  ): ReturnType<IDcaManagerClient['resumeStrategyTx']> {
    return this.rpcClient.armada.dca.resumeStrategyTx.query(params)
  }

  /** @see IDcaManagerClient.cancelStrategyTx */
  async cancelStrategyTx(
    params: Parameters<IDcaManagerClient['cancelStrategyTx']>[0],
  ): ReturnType<IDcaManagerClient['cancelStrategyTx']> {
    return this.rpcClient.armada.dca.cancelStrategyTx.query(params)
  }

  /** @see IDcaManagerClient.getStrategies */
  async getStrategies(
    params: Parameters<IDcaManagerClient['getStrategies']>[0],
  ): ReturnType<IDcaManagerClient['getStrategies']> {
    return this.rpcClient.armada.dca.getStrategies.query(params)
  }

  /** @see IDcaManagerClient.getStrategy */
  async getStrategy(
    params: Parameters<IDcaManagerClient['getStrategy']>[0],
  ): ReturnType<IDcaManagerClient['getStrategy']> {
    return this.rpcClient.armada.dca.getStrategy.query(params)
  }

  /** @see IDcaManagerClient.getExecutions */
  async getExecutions(
    params: Parameters<IDcaManagerClient['getExecutions']>[0],
  ): ReturnType<IDcaManagerClient['getExecutions']> {
    return this.rpcClient.armada.dca.getExecutions.query(params)
  }

  /** @see IDcaManagerClient.getExecution */
  async getExecution(
    params: Parameters<IDcaManagerClient['getExecution']>[0],
  ): ReturnType<IDcaManagerClient['getExecution']> {
    return this.rpcClient.armada.dca.getExecution.query(params)
  }
}
