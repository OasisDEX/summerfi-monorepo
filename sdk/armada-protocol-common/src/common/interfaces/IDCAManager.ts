import type {
  AddressValue,
  IChainlinkFeed,
  IDcaStrategy,
  IDcaStrategyUpdate,
  IDcaExecution,
  ChainId,
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
 * Interface for creating and managing Armada recurring DCA buy orders
 */
export interface IDCAManager {
  /**
   * Builds the transactions to create a new DCA strategy AND make the initial deposit
   * (`depositAndCreate`). Ordered:
   * `[permit2 authorization?, permit2 sub-allowance, inAsset approval?, create]`. The Permit2 steps
   * set up the keeper's recurring pull of source-vault shares (authorization is included only when
   * the ERC20 allowance to Permit2 is insufficient); the inAsset approval is included only when the
   * allowance to the manager is insufficient. The `CreateStrategy` transaction is always last — send
   * them in array order.
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
   * Builds the transactions to create a new DCA strategy WITHOUT an initial deposit
   * (`createStrategy`). The user is expected to already hold the source-vault shares the keeper will
   * pull. Ordered: `[permit2 authorization?, permit2 sub-allowance, create]` — no inAsset approval,
   * since nothing is deposited. The `CreateStrategy` transaction is always last — send them in array
   * order. Same params as {@link depositAndCreateStrategyTx} minus `assetAmount`.
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

  /** Builds the transaction to edit an existing DCA strategy: `strategy` is the current on-chain config (the `oldConfig` proving ownership), `update` the fields to change. */
  editStrategyTx(params: {
    chainId: ChainId
    strategy: IDcaStrategy
    update: IDcaStrategyUpdate
  }): Promise<[EditDcaStrategyTransactionInfo]>

  /** Builds the transaction to pause an active DCA strategy. */
  pauseStrategyTx(params: {
    chainId: ChainId
    strategy: IDcaStrategy
  }): Promise<[PauseDcaStrategyTransactionInfo]>

  /** Builds the transaction to resume a paused DCA strategy. */
  resumeStrategyTx(params: {
    chainId: ChainId
    strategy: IDcaStrategy
  }): Promise<[ResumeDcaStrategyTransactionInfo]>

  /** Builds the transaction to permanently cancel a DCA strategy. */
  cancelStrategyTx(params: {
    chainId: ChainId
    strategy: IDcaStrategy
  }): Promise<[CancelDcaStrategyTransactionInfo]>

  /**
   * Gets all DCA strategies for a chain from the subgraph
   */
  getStrategies(params: {
    chainId: ChainId
    userAddress?: AddressValue
    status?: DcaStrategyStatusEnum
  }): Promise<IDcaStrategy[]>

  /**
   * Gets a single DCA strategy by strategyId from the subgraph
   */
  getStrategy(params: { strategyId: string; chainId: ChainId }): Promise<IDcaStrategy | undefined>

  /**
   * Gets all executions for a given DCA strategy from the subgraph
   */
  getExecutions(params: { chainId: ChainId; strategyId: string }): Promise<IDcaExecution[]>

  /**
   * Gets a single execution by executionId from the subgraph
   */
  getExecution(params: {
    chainId: ChainId
    strategyId: string
    executionId: string
  }): Promise<IDcaExecution | undefined>
}
