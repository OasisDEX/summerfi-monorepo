import type {
  AddressValue,
  ChainId,
  IChainlinkFeed,
  IDcaStrategy,
  IDcaStrategyUpdate,
  IDcaExecution,
  ApproveTransactionInfo,
  CreateDcaStrategyTransactionInfo,
  EditDcaStrategyTransactionInfo,
  PauseDcaStrategyTransactionInfo,
  ResumeDcaStrategyTransactionInfo,
  CancelDcaStrategyTransactionInfo,
  DcaStrategyStatusEnum,
} from '@summerfi/sdk-common'

/**
 * Client interface for DCA order management
 */
export interface IDcaManagerClient {
  /**
   * Builds the transaction(s) that create a new DCA (dollar-cost-averaging) strategy.
   *
   * The strategy creation pulls the initial `assetAmount` from the user, so the result is prefixed
   * with an ERC20 approval transaction when the current allowance is insufficient; otherwise it is a
   * single-element tuple. Send the transactions in order, mining the approval before the create.
   *
   * @param params - Strategy configuration (chain, user, source/target vaults and assets, price
   *   feeds, share amount, slippage, interval, trade count, optional price guards and deadline).
   * @returns A promise resolving to `[createTx]`, or `[approveTx, createTx]` when an approval is needed.
   * @throws If the DCA module is not deployed on `params.chainId`.
   * @example
   * ```ts
   * const txs = await dcaManager.createStrategyTx({ chainId: ChainIds.Base, userAddress, ...config })
   * ```
   */
  createStrategyTx(params: {
    chainId: ChainId
    userAddress: AddressValue
    fromVault: AddressValue
    toVault: AddressValue
    inAsset: AddressValue
    outAsset: AddressValue
    inAssetFeed: IChainlinkFeed
    outAssetFeed: IChainlinkFeed
    /** Per-trade amount (source asset base units). */
    amountShares: string
    /** Initial principal deposited at creation (source asset base units). See plan Open Question 2. */
    assetAmount: string
    slippagePercentage: string
    intervalSeconds: number
    maxTrades: number
    neverBuyAbove?: string
    neverSellBelow?: string
    deadlineUnixTimestamp: number
  }): Promise<
    [CreateDcaStrategyTransactionInfo] | [ApproveTransactionInfo, CreateDcaStrategyTransactionInfo]
  >

  /**
   * Builds the transaction that updates the parameters of an existing DCA strategy.
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain the strategy lives on.
   * @param params.strategy - The current on-chain strategy (as returned by `getStrategy`); used as
   *   the `oldConfig` whose hash must match the stored commitment.
   * @param params.update - The fields to change, merged over `strategy` to form the `newConfig`.
   * @returns A promise resolving to the edit-strategy transaction info.
   * @throws If the strategy is not active or paused.
   * @example
   * ```ts
   * const [editTx] = await dcaManager.editStrategyTx({
   *   chainId: ChainIds.Base,
   *   strategy: existingStrategy,
   *   update: { slippagePercentage: 1 },
   * })
   * ```
   */
  editStrategyTx(params: {
    chainId: ChainId
    strategy: IDcaStrategy
    update: IDcaStrategyUpdate
  }): Promise<[EditDcaStrategyTransactionInfo]>

  /**
   * Builds the transaction that pauses an active DCA strategy.
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain the strategy lives on.
   * @param params.strategy - The current on-chain strategy to pause.
   * @returns A promise resolving to the pause-strategy transaction info.
   * @throws If the DCA module is not deployed on `params.chainId`, or the strategy is not active.
   * @example
   * ```ts
   * const [pauseTx] = await dcaManager.pauseStrategyTx({ chainId: ChainIds.Base, strategy })
   * ```
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
   * @param params.strategy - The current on-chain strategy to resume.
   * @returns A promise resolving to the resume-strategy transaction info.
   * @throws If the DCA module is not deployed on `params.chainId`, or the strategy is not paused.
   * @example
   * ```ts
   * const [resumeTx] = await dcaManager.resumeStrategyTx({ chainId: ChainIds.Base, strategy })
   * ```
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
   * @param params.strategy - The current on-chain strategy to cancel.
   * @returns A promise resolving to the cancel-strategy transaction info.
   * @throws If the DCA module is not deployed on `params.chainId`, or the strategy is not active or
   *   paused.
   * @example
   * ```ts
   * const [cancelTx] = await dcaManager.cancelStrategyTx({ chainId: ChainIds.Base, strategy })
   * ```
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
