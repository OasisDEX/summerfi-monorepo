import type {
  AddressValue,
  IDcaStrategy,
  IDcaExecution,
  ChainId,
  CreateDcaStrategyTransactionInfo,
  EditDcaStrategyTransactionInfo,
  PauseDcaStrategyTransactionInfo,
  ResumeDcaStrategyTransactionInfo,
  CancelDcaStrategyTransactionInfo,
  DcaStrategyStatusEnum,
} from '@summerfi/sdk-common'

/**
 * @name IDCAManager
 * @description Interface for creating and managing Armada recurring DCA buy orders
 */
export interface IDCAManager {
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
    deadlineUnixTimestamp?: number
  }): Promise<[CreateDcaStrategyTransactionInfo]>

  editStrategyTx(params: {
    chainId: ChainId
    strategy: IDcaStrategy
  }): Promise<[EditDcaStrategyTransactionInfo]>

  pauseStrategyTx(params: {
    chainId: ChainId
    strategy: IDcaStrategy
  }): Promise<[PauseDcaStrategyTransactionInfo]>

  resumeStrategyTx(params: {
    chainId: ChainId
    strategy: IDcaStrategy
  }): Promise<[ResumeDcaStrategyTransactionInfo]>

  cancelStrategyTx(params: {
    chainId: ChainId
    strategy: IDcaStrategy
  }): Promise<[CancelDcaStrategyTransactionInfo]>

  /**
   * @name getStrategies
   * @description Gets all DCA strategies for a chain from the subgraph
   */
  getStrategies(params: {
    chainId: ChainId
    userAddress?: AddressValue
    status?: DcaStrategyStatusEnum
  }): Promise<IDcaStrategy[]>

  /**
   * @name getStrategy
   * @description Gets a single DCA strategy by strategyId from the subgraph
   */
  getStrategy(params: { strategyId: string; chainId: ChainId }): Promise<IDcaStrategy | undefined>

  /**
   * @name getExecutions
   * @description Gets all executions for a given DCA strategy from the subgraph
   */
  getExecutions(params: { chainId: ChainId; strategyId: string }): Promise<IDcaExecution[]>

  /**
   * @name getExecution
   * @description Gets a single execution by executionId from the subgraph
   */
  getExecution(params: {
    chainId: ChainId
    strategyId: string
    executionId: string
  }): Promise<IDcaExecution | undefined>
}
