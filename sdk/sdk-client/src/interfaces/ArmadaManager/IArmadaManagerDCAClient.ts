import type { ArmadaDcaOrder, ArmadaDcaOrderStatus } from '@summerfi/armada-protocol-common'
import type { AddressValue, ChainId, HexData } from '@summerfi/sdk-common'

/**
 * @name IArmadaManagerDCAClient
 * @description Client interface for Armada DCA order management
 */
export interface IArmadaManagerDCAClient {
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
    /** Unix timestamp after which the order stops executing (optional) */
    deadlineUnixTimestamp?: number
    /** Maximum number of trades to execute before the order completes */
    maxTrades: number
    /** Price ceiling — skip execution if the fromVault token price is above this value (optional) */
    neverBuyAbove?: string
    /** Price floor — skip execution if the toVault token price is below this value (optional) */
    neverSellBelow?: string
  }): Promise<ArmadaDcaOrder>

  getBuyOrder(params: {
    orderId: string
    userAddress: AddressValue
  }): Promise<ArmadaDcaOrder | undefined>

  getBuyOrders(params: {
    userAddress: AddressValue
    chainId?: ChainId
    status?: ArmadaDcaOrderStatus
  }): Promise<ArmadaDcaOrder[]>

  cancelBuyOrder(params: {
    orderId: string
    userAddress: AddressValue
    signedMessage: string
    signature: HexData
  }): Promise<ArmadaDcaOrder>

  pauseBuyOrder(params: {
    orderId: string
    userAddress: AddressValue
    signedMessage: string
    signature: HexData
  }): Promise<ArmadaDcaOrder>

  resumeBuyOrder(params: {
    orderId: string
    userAddress: AddressValue
    signedMessage: string
    signature: HexData
  }): Promise<ArmadaDcaOrder>
}
