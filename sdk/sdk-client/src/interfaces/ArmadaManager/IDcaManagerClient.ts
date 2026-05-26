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
    strategyId: string
  }): Promise<[EditDcaStrategyTransactionInfo]>

  pauseStrategyTx(params: {
    chainId: ChainId
    strategyId: string
  }): Promise<[PauseDcaStrategyTransactionInfo]>

  resumeStrategyTx(params: {
    chainId: ChainId
    strategy: IDcaStrategy
    strategyId: string
  }): Promise<[ResumeDcaStrategyTransactionInfo]>

  cancelStrategyTx(params: {
    chainId: ChainId
    strategyId: string
  }): Promise<[CancelDcaStrategyTransactionInfo]>

  getStrategies(params: {
    chainId: ChainId
    userAddress?: AddressValue
    status?: DcaStrategyStatusEnum
  }): Promise<IDcaStrategy[]>

  getStrategy(params: { strategyId: string; chainId: ChainId }): Promise<IDcaStrategy | undefined>

  getExecutions(params: { chainId: ChainId; strategyId: string }): Promise<IDcaExecution[]>

  getExecution(params: {
    chainId: ChainId
    strategyId: string
    executionId: string
  }): Promise<IDcaExecution | undefined>
}
