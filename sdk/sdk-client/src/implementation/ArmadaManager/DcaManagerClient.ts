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

  /**
   * Builds the transaction(s) that create a new DCA strategy (via the `armada.dca` tRPC route).
   *
   * The result is prefixed with an ERC20 approval when the strategy manager's allowance is
   * insufficient; otherwise it is a single-element tuple. Send the transactions in order.
   *
   * @param params - Strategy configuration — see {@link IDcaManagerClient.createStrategyTx}.
   * @returns Either `[createTx]` or `[approveTx, createTx]`.
   * @throws If the DCA module is not deployed on `params.chainId`.
   * @example
   * ```ts
   * const txs = await sdk.dca.createStrategyTx({ chainId: ChainIds.Base, userAddress, ...config })
   * ```
   */
  async createStrategyTx(
    params: Parameters<IDcaManagerClient['createStrategyTx']>[0],
  ): ReturnType<IDcaManagerClient['createStrategyTx']> {
    return this.rpcClient.armada.dca.createStrategyTx.query(params)
  }

  /**
   * Builds the transaction that edits an existing DCA strategy (via the `armada.dca` tRPC route).
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain the strategy lives on.
   * @param params.strategy - The current on-chain strategy (as returned by `getStrategy`); used as
   *   the `oldConfig` whose hash must match the stored commitment.
   * @param params.update - The fields to change, merged over `strategy` to form the `newConfig`.
   * @returns The edit-strategy transaction (single-element tuple).
   * @throws If the DCA module is not deployed on `params.chainId`, or the strategy is not active or
   *   paused.
   * @example
   * ```ts
   * const [editTx] = await sdk.dca.editStrategyTx({
   *   chainId: ChainIds.Base,
   *   strategy: existingStrategy,
   *   update: { slippagePercentage: 1 },
   * })
   * ```
   */
  async editStrategyTx(
    params: Parameters<IDcaManagerClient['editStrategyTx']>[0],
  ): ReturnType<IDcaManagerClient['editStrategyTx']> {
    return this.rpcClient.armada.dca.editStrategyTx.query(params)
  }

  /**
   * Builds the transaction that pauses an active DCA strategy (via the `armada.dca` tRPC route).
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain the strategy lives on.
   * @param params.strategy - The current on-chain strategy to pause.
   * @returns The pause-strategy transaction (single-element tuple).
   * @throws If the DCA module is not deployed on `params.chainId`, or the strategy is not active.
   * @example
   * ```ts
   * const [pauseTx] = await sdk.dca.pauseStrategyTx({ chainId: ChainIds.Base, strategy })
   * ```
   */
  async pauseStrategyTx(
    params: Parameters<IDcaManagerClient['pauseStrategyTx']>[0],
  ): ReturnType<IDcaManagerClient['pauseStrategyTx']> {
    return this.rpcClient.armada.dca.pauseStrategyTx.query(params)
  }

  /**
   * Builds the transaction that resumes a paused DCA strategy (via the `armada.dca` tRPC route).
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain the strategy lives on.
   * @param params.strategy - The current on-chain strategy to resume.
   * @returns The resume-strategy transaction (single-element tuple).
   * @throws If the DCA module is not deployed on `params.chainId`, or the strategy is not paused.
   * @example
   * ```ts
   * const [resumeTx] = await sdk.dca.resumeStrategyTx({ chainId: ChainIds.Base, strategy })
   * ```
   */
  async resumeStrategyTx(
    params: Parameters<IDcaManagerClient['resumeStrategyTx']>[0],
  ): ReturnType<IDcaManagerClient['resumeStrategyTx']> {
    return this.rpcClient.armada.dca.resumeStrategyTx.query(params)
  }

  /**
   * Builds the transaction that permanently cancels a DCA strategy (via the `armada.dca` tRPC route).
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain the strategy lives on.
   * @param params.strategy - The current on-chain strategy to cancel.
   * @returns The cancel-strategy transaction (single-element tuple).
   * @throws If the DCA module is not deployed on `params.chainId`, or the strategy is not active or
   *   paused.
   * @example
   * ```ts
   * const [cancelTx] = await sdk.dca.cancelStrategyTx({ chainId: ChainIds.Base, strategy })
   * ```
   */
  async cancelStrategyTx(
    params: Parameters<IDcaManagerClient['cancelStrategyTx']>[0],
  ): ReturnType<IDcaManagerClient['cancelStrategyTx']> {
    return this.rpcClient.armada.dca.cancelStrategyTx.query(params)
  }

  /**
   * Lists DCA strategies on a chain, optionally filtered by owner and status (via the `armada.dca`
   * tRPC route).
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain to query.
   * @param params.userAddress - Optional owner address to filter by.
   * @param params.status - Optional strategy status to filter by.
   * @returns The matching strategies (empty array if none).
   * @throws If the DCA module is not deployed on `params.chainId`.
   * @example
   * ```ts
   * const strategies = await sdk.dca.getStrategies({ chainId: ChainIds.Base })
   * ```
   */
  async getStrategies(
    params: Parameters<IDcaManagerClient['getStrategies']>[0],
  ): ReturnType<IDcaManagerClient['getStrategies']> {
    return this.rpcClient.armada.dca.getStrategies.query(params)
  }

  /**
   * Fetches a single DCA strategy by its on-chain id (via the `armada.dca` tRPC route).
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain the strategy lives on.
   * @param params.strategyId - The on-chain id of the strategy to fetch.
   * @returns The strategy, or `undefined` if not found.
   * @throws If the DCA module is not deployed on `params.chainId`.
   * @example
   * ```ts
   * const strategy = await sdk.dca.getStrategy({ chainId: ChainIds.Base, strategyId: '3' })
   * ```
   */
  async getStrategy(
    params: Parameters<IDcaManagerClient['getStrategy']>[0],
  ): ReturnType<IDcaManagerClient['getStrategy']> {
    return this.rpcClient.armada.dca.getStrategy.query(params)
  }

  /**
   * Lists the executions (individual trades) of a DCA strategy (via the `armada.dca` tRPC route).
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain the strategy lives on.
   * @param params.strategyId - The on-chain id of the strategy whose executions to list.
   * @returns The strategy's executions (empty array if none).
   * @throws If the DCA module is not deployed on `params.chainId`.
   * @example
   * ```ts
   * const executions = await sdk.dca.getExecutions({ chainId: ChainIds.Base, strategyId: '3' })
   * ```
   */
  async getExecutions(
    params: Parameters<IDcaManagerClient['getExecutions']>[0],
  ): ReturnType<IDcaManagerClient['getExecutions']> {
    return this.rpcClient.armada.dca.getExecutions.query(params)
  }

  /**
   * Fetches a single execution of a DCA strategy by its id (via the `armada.dca` tRPC route).
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain the strategy lives on.
   * @param params.strategyId - The on-chain id of the strategy the execution belongs to.
   * @param params.executionId - The id of the execution to fetch.
   * @returns The execution, or `undefined` if not found.
   * @throws If the DCA module is not deployed on `params.chainId`.
   * @example
   * ```ts
   * const execution = await sdk.dca.getExecution({
   *   chainId: ChainIds.Base,
   *   strategyId: '3',
   *   executionId,
   * })
   * ```
   */
  async getExecution(
    params: Parameters<IDcaManagerClient['getExecution']>[0],
  ): ReturnType<IDcaManagerClient['getExecution']> {
    return this.rpcClient.armada.dca.getExecution.query(params)
  }
}
