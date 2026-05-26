import type {
  AddressValue,
  ChainId,
  HexData,
  IArmadaDcaOrder,
  ITokenAmount,
  CreateDcaStrategyTransactionInfo,
  EditDcaStrategyTransactionInfo,
  PauseDcaStrategyTransactionInfo,
  ResumeDcaStrategyTransactionInfo,
  CancelDcaStrategyTransactionInfo,
  DcaStrategyStatusEnum,
} from '@summerfi/sdk-common'
import type { GetStrategiesQuery, GetExecutionsQuery } from '@summerfi/subgraph-manager-common'
import type { SignTypedDataParameters } from 'viem'

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
  }): Promise<CreateDcaStrategyTransactionInfo>

  editStrategyTx(params: {
    chainId: ChainId
    order: IArmadaDcaOrder
    strategyId: string
  }): Promise<EditDcaStrategyTransactionInfo>

  pauseStrategyTx(params: {
    chainId: ChainId
    strategyId: string
  }): Promise<PauseDcaStrategyTransactionInfo>

  resumeStrategyTx(params: {
    chainId: ChainId
    order: IArmadaDcaOrder
    strategyId: string
  }): Promise<ResumeDcaStrategyTransactionInfo>

  cancelStrategyTx(params: {
    chainId: ChainId
    strategyId: string
  }): Promise<CancelDcaStrategyTransactionInfo>

  createAndSaveBuyOrder(params: {
    orderId: string
    userAddress: AddressValue
    chainId: ChainId
    fromVault: AddressValue
    toVault: AddressValue
    signTypedData: (params: SignTypedDataParameters) => Promise<`0x${string}`>
    amountShares: ITokenAmount
    /** Slippage as a percentage (e.g. "0.5" for 0.5%) */
    slippagePercentage: string
    intervalSeconds: number
    /** Unix timestamp of the first scheduled execution */
    firstExecutionUnixTimestamp: number
    /** Unix timestamp after which the order stops executing (optional) */
    deadlineUnixTimestamp?: number
    /** Maximum number of trades to execute before the order completes */
    maxTrades: number
    /** Price ceiling — skip execution if the fromVault token price is above this value (optional) */
    neverBuyAbove?: string
    /** Price floor — skip execution if the toVault token price is below this value (optional) */
    neverSellBelow?: string
    /** The underlying asset of the source vault */
    inAsset: AddressValue
    /** The underlying asset of the target vault */
    outAsset: AddressValue
    /** Oracle price feed address for the input asset */
    inAssetFeed: AddressValue
    /** Oracle price feed address for the output asset */
    outAssetFeed: AddressValue
  }): Promise<IArmadaDcaOrder>

  editBuyOrder(params: {
    id: string
    orderId: string
    userAddress: AddressValue
    chainId: ChainId
    fromVault: AddressValue
    toVault: AddressValue
    signTypedData: (params: SignTypedDataParameters) => Promise<`0x${string}`>
    amountShares: ITokenAmount
    /** Slippage as a percentage (e.g. "0.5" for 0.5%) */
    slippagePercentage: string
    intervalSeconds: number
    /** Unix timestamp of the first scheduled execution */
    firstExecutionUnixTimestamp: number
    /** Unix timestamp after which the order stops executing (optional) */
    deadlineUnixTimestamp?: number
    /** Maximum number of trades to execute before the order completes */
    maxTrades: number
    /** Price ceiling — skip execution if the fromVault token price is above this value (optional) */
    neverBuyAbove?: string
    /** Price floor — skip execution if the toVault token price is below this value (optional) */
    neverSellBelow?: string
    /** EARN JWT bearer token for authentication */
    bearerToken: string
  }): Promise<IArmadaDcaOrder>

  getStrategies(params: {
    chainId: ChainId
    userAddress?: AddressValue
    status?: DcaStrategyStatusEnum
  }): Promise<GetStrategiesQuery>

  getStrategy(params: {
    strategyId: string
    chainId: ChainId
  }): Promise<GetStrategiesQuery['strategies'][0] | undefined>

  getExecutions(params: { chainId: ChainId; strategyId: string }): Promise<GetExecutionsQuery>

  getExecution(params: {
    chainId: ChainId
    strategyId: string
    executionId: string
  }): Promise<GetExecutionsQuery['executions'][0] | undefined>

  cancelBuyOrder(params: { orderId: string; userAddress: AddressValue }): Promise<IArmadaDcaOrder>

  pauseBuyOrder(params: {
    orderId: string
    userAddress: AddressValue
    signature: HexData
  }): Promise<IArmadaDcaOrder>

  resumeBuyOrder(params: { orderId: string; userAddress: AddressValue }): Promise<IArmadaDcaOrder>
}
