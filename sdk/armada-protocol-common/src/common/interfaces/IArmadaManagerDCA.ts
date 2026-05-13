import type { IAddress, IChainInfo, IUser } from '@summerfi/sdk-common'
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
    user: IUser
    chainInfo: IChainInfo
    fromVault: IAddress
    toVault: IAddress
    amount: string
    slippage: string
    intervalSeconds: number
    ensoRouterAddress: IAddress
    nextExecutionAt?: number
    deadline?: string
  }): Promise<ArmadaDcaOrder>

  /**
   * @name getBuyOrder
   * @description Gets a single DCA buy order owned by a user
   */
  getBuyOrder(params: { orderId: string; user: IUser }): Promise<ArmadaDcaOrder | undefined>

  /**
   * @name getBuyOrders
   * @description Gets DCA buy orders for a user
   */
  getBuyOrders(params: {
    user: IUser
    chainInfo?: IChainInfo
    status?: ArmadaDcaOrderStatus
  }): Promise<ArmadaDcaOrder[]>

  /**
   * @name cancelBuyOrder
   * @description Marks a DCA buy order as cancelled
   */
  cancelBuyOrder(params: { orderId: string; user: IUser }): Promise<ArmadaDcaOrder>
}
