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
  Permit2AuthorizationTransactionInfo,
  Permit2SubAllowanceTransactionInfo,
  DcaStrategyStatusEnum,
} from '@summerfi/sdk-common'

/**
 * Client interface for DCA order management
 */
export interface IDcaManagerClient {
  /**
   * Builds the transactions that create a new DCA strategy AND make the initial deposit
   * (`depositAndCreate`).
   *
   * Ordered: `[permit2 authorization?, permit2 sub-allowance, inAsset approval?, create]`. The
   * Permit2 steps set up the keeper's recurring pull of source-vault shares (authorization is
   * included only when the ERC20 allowance to Permit2 is insufficient); the inAsset approval is
   * included only when the allowance to the manager is insufficient. Send the transactions in array
   * order — the `CreateStrategy` transaction is always last.
   *
   * @param params - Strategy configuration plus the `assetAmount` to deposit at creation.
   * @returns A promise resolving to the ordered array of transactions to send.
   * @throws If the DCA module is not deployed on `params.chainId`.
   * @example
   * ```ts
   * const txs = await dcaManager.depositAndCreateStrategyTx({ chainId: ChainIds.Base, userAddress, ...config })
   * ```
   */
  depositAndCreateStrategyTx(params: {
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
    /** Initial principal deposited at creation (in-asset base units). Must be non-zero. */
    assetAmount: string
    slippagePercentage: string
    intervalSeconds: number
    maxTrades: number
    neverBuyAbove?: string
    neverSellBelow?: string
    deadlineUnixTimestamp: number
  }): Promise<
    // Ordered [permit2 authorization?, permit2 sub-allowance, inAsset approval?, create]; the two
    // optional slots yield these four exact shapes (CreateStrategy is always last).
    | [Permit2SubAllowanceTransactionInfo, CreateDcaStrategyTransactionInfo]
    | [
        Permit2AuthorizationTransactionInfo,
        Permit2SubAllowanceTransactionInfo,
        CreateDcaStrategyTransactionInfo,
      ]
    | [Permit2SubAllowanceTransactionInfo, ApproveTransactionInfo, CreateDcaStrategyTransactionInfo]
    | [
        Permit2AuthorizationTransactionInfo,
        Permit2SubAllowanceTransactionInfo,
        ApproveTransactionInfo,
        CreateDcaStrategyTransactionInfo,
      ]
  >

  /**
   * Builds the transactions that create a new DCA strategy WITHOUT an initial deposit
   * (`createStrategy`). The user is expected to already hold the source-vault shares the keeper will
   * pull.
   *
   * Ordered: `[permit2 authorization?, permit2 sub-allowance, create]` — no inAsset approval, since
   * nothing is deposited. Send the transactions in array order — the `CreateStrategy` transaction is
   * always last. Same params as {@link depositAndCreateStrategyTx} minus `assetAmount`.
   *
   * @param params - Strategy configuration (no deposit).
   * @returns A promise resolving to the ordered array of transactions to send.
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
    /** Per-trade amount (source-vault share base units). */
    amountShares: string
    slippagePercentage: string
    intervalSeconds: number
    maxTrades: number
    neverBuyAbove?: string
    neverSellBelow?: string
    deadlineUnixTimestamp: number
  }): Promise<
    // Ordered [permit2 authorization?, permit2 sub-allowance, create]; the optional auth slot yields
    // these two exact shapes (CreateStrategy is always last).
    | [Permit2SubAllowanceTransactionInfo, CreateDcaStrategyTransactionInfo]
    | [
        Permit2AuthorizationTransactionInfo,
        Permit2SubAllowanceTransactionInfo,
        CreateDcaStrategyTransactionInfo,
      ]
  >

  /**
   * Builds the transaction that updates the parameters of an existing DCA strategy.
   *
   * @param params - Parameters object.
   * @param params.chainId - The chain the strategy lives on.
   * @param params.strategy - The current on-chain strategy (as returned by `getStrategy`); used as
   *   the `oldConfig` whose hash must match the stored commitment.
   * @param params.update - The fields to change, merged over `strategy` to form the `newConfig`.
   * @returns A promise resolving to the ordered transactions to send. When the edit changes the
   *   keeper's pull requirement (`tradeAmount`/`maxTrades`) or the pulled token (`sourceVault`), the
   *   edit is prefixed with the Permit2 setup the new config needs (authorization only when the ERC20
   *   allowance to Permit2 is insufficient; a sub-allowance only when the current one is short or
   *   expired). The `EditStrategy` transaction is always last.
   * @throws If the strategy is not active or paused.
   * @example
   * ```ts
   * const txs = await dcaManager.editStrategyTx({
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
  }): Promise<
    // Ordered [permit2 authorization?, permit2 sub-allowance?, edit]; the two optional slots yield
    // these four exact shapes (EditStrategy is always last).
    | [EditDcaStrategyTransactionInfo]
    | [Permit2SubAllowanceTransactionInfo, EditDcaStrategyTransactionInfo]
    | [Permit2AuthorizationTransactionInfo, EditDcaStrategyTransactionInfo]
    | [
        Permit2AuthorizationTransactionInfo,
        Permit2SubAllowanceTransactionInfo,
        EditDcaStrategyTransactionInfo,
      ]
  >

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
