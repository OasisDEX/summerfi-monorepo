import type { AddressValue, ChainId, HexData } from '@summerfi/sdk-common'
import type { ArmadaDcaOrder, ArmadaDcaOrderStatus } from '../types/ArmadaDcaOrder'

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
    /** Unix timestamp of the next scheduled execution */
    nextExecutionAtUnixTimestamp: number
    /** Unix timestamp after which the order expires */
    deadlineUnixTimestamp: number
  }): Promise<ArmadaDcaOrder>

  /**
   * @name getBuyOrder
   * @description Gets a single DCA buy order owned by a user
   */
  getBuyOrder(params: {
    orderId: string
    userAddress: AddressValue
  }): Promise<ArmadaDcaOrder | undefined>

  /**
   * @name getBuyOrders
   * @description Gets DCA buy orders for a user
   */
  getBuyOrders(params: {
    userAddress: AddressValue
    chainId?: ChainId
    status?: ArmadaDcaOrderStatus
  }): Promise<ArmadaDcaOrder[]>

  /**
   * @name cancelBuyOrder
   * @description Marks a DCA buy order as cancelled
   */
  cancelBuyOrder(params: {
    orderId: string
    userAddress: AddressValue
    signedMessage: string
    signature: HexData
  }): Promise<ArmadaDcaOrder>
}
