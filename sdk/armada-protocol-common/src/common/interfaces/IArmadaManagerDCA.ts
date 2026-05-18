import type {
  AddressValue,
  IArmadaDcaOrder,
  ChainId,
  HexData,
  ArmadaDcaOrderStatusEnum,
} from '@summerfi/sdk-common'

/**
 * @name IArmadaManagerDCA
 * @description Interface for creating and managing Armada recurring DCA buy orders
 */
export interface IArmadaManagerDCA {
  /**
   * @name createAndSaveBuyOrder
   * @description Creates a signed DCA buy order payload and persists it in the database
   */
  createAndSaveBuyOrder(params: {
    userAddress: AddressValue
    chainId: ChainId
    fromVault: AddressValue
    toVault: AddressValue
    /** Full token amount (e.g. "1.5" for 1.5 USDC, not raw units) */
    amount: string
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
  }): Promise<IArmadaDcaOrder>

  /**
   * @name getBuyOrder
   * @description Gets a single DCA buy order owned by a user
   */
  getBuyOrder(params: {
    orderId: string
    userAddress: AddressValue
  }): Promise<IArmadaDcaOrder | undefined>

  /**
   * @name getBuyOrders
   * @description Gets DCA buy orders for a user
   */
  getBuyOrders(params: {
    userAddress: AddressValue
    chainId?: ChainId
    status?: ArmadaDcaOrderStatusEnum
  }): Promise<IArmadaDcaOrder[]>

  /**
   * @name cancelBuyOrder
   * @description Marks a DCA buy order as cancelled
   */
  cancelBuyOrder(params: {
    orderId: string
    userAddress: AddressValue
    signedMessage: string
    signature: HexData
  }): Promise<IArmadaDcaOrder>

  /**
   * @name pauseBuyOrder
   * @description Pauses an active DCA buy order. Requires a signed message: "I want to pause <orderId>."
   */
  pauseBuyOrder(params: {
    orderId: string
    userAddress: AddressValue
    signedMessage: string
    signature: HexData
  }): Promise<IArmadaDcaOrder>

  /**
   * @name resumeBuyOrder
   * @description Resumes a paused DCA buy order. Requires a signed message: "I want to resume <orderId>."
   */
  resumeBuyOrder(params: {
    orderId: string
    userAddress: AddressValue
    signedMessage: string
    signature: HexData
  }): Promise<IArmadaDcaOrder>
}
