import type { ArmadaDcaOrder, ArmadaDcaOrderStatus } from '@summerfi/armada-protocol-common'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

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
    nextExecutionAt?: number
    deadline?: string
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

  cancelBuyOrder(params: { orderId: string; userAddress: AddressValue }): Promise<ArmadaDcaOrder>
}
