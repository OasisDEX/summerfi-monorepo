import type { ArmadaDcaOrder, ArmadaDcaOrderStatus } from '@summerfi/armada-protocol-common'
import type { IAddress, IChainInfo, IUser } from '@summerfi/sdk-common'

/**
 * @name IArmadaManagerDCAClient
 * @description Client interface for Armada DCA order management
 */
export interface IArmadaManagerDCAClient {
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

  getBuyOrder(params: { orderId: string; user: IUser }): Promise<ArmadaDcaOrder | undefined>

  getBuyOrders(params: {
    user: IUser
    chainInfo?: IChainInfo
    status?: ArmadaDcaOrderStatus
  }): Promise<ArmadaDcaOrder[]>

  cancelBuyOrder(params: { orderId: string; user: IUser }): Promise<ArmadaDcaOrder>
}
