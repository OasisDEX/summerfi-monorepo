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
  DcaStrategyStatusEnum,
} from '@summerfi/sdk-common'

/**
 * Interface for creating and managing Armada recurring DCA buy orders
 */
export interface IDCAManager {
  /** Builds the transaction(s) to create a new DCA strategy (prefixed with an ERC20 approval when the allowance is insufficient). */
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
