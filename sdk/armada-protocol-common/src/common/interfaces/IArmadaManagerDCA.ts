import type {
  AddressValue,
  IArmadaDcaOrder,
  ChainId,
  HexData,
  ITokenAmount,
  CreateDcaStrategyTransactionInfo,
  EditDcaStrategyTransactionInfo,
  PauseDcaStrategyTransactionInfo,
  ResumeDcaStrategyTransactionInfo,
  CancelDcaStrategyTransactionInfo,
  ExecuteDcaTransactionInfo,
} from '@summerfi/sdk-common'
import type { GetStrategiesQuery, GetExecutionsQuery } from '@summerfi/subgraph-manager-common'

/**
 * @name IArmadaManagerDCA
 * @description Interface for creating and managing Armada recurring DCA buy orders
 */
export interface IArmadaManagerDCA {
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

  executeDCATx(params: {
    chainId: ChainId
    order: IArmadaDcaOrder
    strategyId: string
  }): Promise<ExecuteDcaTransactionInfo>

  /**
   * @name createAndSaveBuyOrder
   * @description Creates a signed DCA buy order payload and persists it in the database
   */
  createAndSaveBuyOrder(params: {
    orderId: string
    userAddress: AddressValue
    chainId: ChainId
    fromVault: AddressValue
    toVault: AddressValue
    rebalanceAuthorizationSignature: HexData
    amountShares: ITokenAmount
    /** Slippage as a percentage (e.g. "0.5" for 0.5%) */
    slippagePercentage: string
    intervalSeconds: number
    /** Unix timestamp of the first scheduled execution */
    firstExecutionUnixTimestamp: number
    /** Unix timestamp after which the order stops executing (optional — absent means run until maxTrades is reached) */
    deadlineUnixTimestamp?: number
    /** Maximum number of trades to execute before the order completes (required) */
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

  /**
   * @name editBuyOrder
   * @description Updates an existing DCA buy order. Requires a verified EARN JWT bearer token.
   */
  editBuyOrder(params: {
    id: string
    orderId: string
    userAddress: AddressValue
    chainId: ChainId
    fromVault: AddressValue
    toVault: AddressValue
    rebalanceAuthorizationSignature: HexData
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
  }): Promise<IArmadaDcaOrder>

  /**
   * @name getStrategies
   * @description Gets all DCA strategies for a chain from the subgraph
   */
  getStrategies(params: { chainId: ChainId; userAddress?: AddressValue }): Promise<GetStrategiesQuery>

  /**
   * @name getStrategy
   * @description Gets a single DCA strategy by strategyId from the subgraph
   */
  getStrategy(params: {
    strategyId: string
    chainId: ChainId
  }): Promise<GetStrategiesQuery['strategies'][0] | undefined>

  /**
   * @name getExecutions
   * @description Gets all executions for a given DCA strategy from the subgraph
   */
  getExecutions(params: {
    chainId: ChainId
    strategyId: string
  }): Promise<GetExecutionsQuery>

  /**
   * @name getExecution
   * @description Gets a single execution by executionId from the subgraph
   */
  getExecution(params: {
    chainId: ChainId
    strategyId: string
    executionId: string
  }): Promise<GetExecutionsQuery['executions'][0] | undefined>

  /**
   * @name cancelBuyOrder
   * @description Marks a DCA buy order as cancelled
   */
  cancelBuyOrder(params: { orderId: string; userAddress: AddressValue }): Promise<IArmadaDcaOrder>

  /**
   * @name pauseBuyOrder
   * @description Pauses an active DCA buy order. Requires a signed message: "I want to pause <orderId>."
   */
  pauseBuyOrder(params: { orderId: string; userAddress: AddressValue }): Promise<IArmadaDcaOrder>

  /**
   * @name resumeBuyOrder
   * @description Resumes a paused DCA buy order. Requires a signed message: "I want to resume <orderId>."
   */
  resumeBuyOrder(params: { orderId: string; userAddress: AddressValue }): Promise<IArmadaDcaOrder>
}
