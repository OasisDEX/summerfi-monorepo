import type {
  AddressValue,
  ChainId,
  IDcaStrategy,
  IDcaExecution,
  CreateDcaStrategyTransactionInfo,
  EditDcaStrategyTransactionInfo,
  PauseDcaStrategyTransactionInfo,
  ResumeDcaStrategyTransactionInfo,
  CancelDcaStrategyTransactionInfo,
  DcaStrategyStatusEnum,
} from '@summerfi/sdk-common'

/**
 * @name IDcaManagerClient
 * @description Client interface for DCA order management
 */
export interface IDcaManagerClient {
  /**
   * Builds the transaction that creates a new DCA (dollar-cost-averaging) strategy.
   *
   * @param params - Strategy configuration (chain, user, source/target vaults and assets, price
   *   feeds, share amount, slippage, interval, trade count, optional price guards and deadline).
   * @returns A promise resolving to the create-strategy transaction info.
   */
  createStrategyTx(params: {
    chainId: ChainId
    userAddress: AddressValue
    fromVault: AddressValue
    toVault: AddressValue
    inAsset: AddressValue
    outAsset: AddressValue
    inAssetFeed: AddressValue
    outAssetFeed: AddressValue
    amountShares: string
    slippagePercentage: string
    intervalSeconds: number
    maxTrades: number
    neverBuyAbove?: string
    neverSellBelow?: string
    deadlineUnixTimestamp: number
  }): Promise<[CreateDcaStrategyTransactionInfo]>

  /**
   * Builds the transaction that updates the parameters of an existing DCA strategy.
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain the strategy lives on.
   * @param params.strategy - The strategy (with its updated fields) to apply.
   * @returns A promise resolving to the edit-strategy transaction info.
   */
  editStrategyTx(params: {
    chainId: ChainId
    strategy: IDcaStrategy
  }): Promise<[EditDcaStrategyTransactionInfo]>

  /**
   * Builds the transaction that pauses an active DCA strategy.
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain the strategy lives on.
   * @param params.strategy - The strategy to pause.
   * @returns A promise resolving to the pause-strategy transaction info.
   */
  pauseStrategyTx(params: {
    chainId: ChainId
    strategy: IDcaStrategy
  }): Promise<[PauseDcaStrategyTransactionInfo]>

  /**
   * Builds the transaction that resumes a previously paused DCA strategy.
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain the strategy lives on.
   * @param params.strategy - The strategy to resume.
   * @returns A promise resolving to the resume-strategy transaction info.
   */
  resumeStrategyTx(params: {
    chainId: ChainId
    strategy: IDcaStrategy
  }): Promise<[ResumeDcaStrategyTransactionInfo]>

  /**
   * Builds the transaction that permanently cancels a DCA strategy.
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain the strategy lives on.
   * @param params.strategy - The strategy to cancel.
   * @returns A promise resolving to the cancel-strategy transaction info.
   */
  cancelStrategyTx(params: {
    chainId: ChainId
    strategy: IDcaStrategy
  }): Promise<[CancelDcaStrategyTransactionInfo]>

  /**
   * Lists DCA strategies on a chain, optionally filtered by user and status.
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain to query.
   * @param params.userAddress - Optional owner address to filter by.
   * @param params.status - Optional strategy status to filter by.
   * @returns A promise resolving to the matching strategies.
   */
  getStrategies(params: {
    chainId: ChainId
    userAddress?: AddressValue
    status?: DcaStrategyStatusEnum
  }): Promise<IDcaStrategy[]>

  /**
   * Fetches a single DCA strategy by its id.
   *
   * @param params - Parameters object.
   * @param params.strategyId - The id of the strategy to fetch.
   * @param params.chainId - The chain the strategy lives on.
   * @returns A promise resolving to the strategy, or `undefined` if not found.
   */
  getStrategy(params: { strategyId: string; chainId: ChainId }): Promise<IDcaStrategy | undefined>

  /**
   * Lists the executions (individual trades) performed by a DCA strategy.
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain the strategy lives on.
   * @param params.strategyId - The id of the strategy whose executions to list.
   * @returns A promise resolving to the strategy's executions.
   */
  getExecutions(params: { chainId: ChainId; strategyId: string }): Promise<IDcaExecution[]>

  /**
   * Fetches a single execution of a DCA strategy by its id.
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain the strategy lives on.
   * @param params.strategyId - The id of the strategy the execution belongs to.
   * @param params.executionId - The id of the execution to fetch.
   * @returns A promise resolving to the execution, or `undefined` if not found.
   */
  getExecution(params: {
    chainId: ChainId
    strategyId: string
    executionId: string
  }): Promise<IDcaExecution | undefined>
}
