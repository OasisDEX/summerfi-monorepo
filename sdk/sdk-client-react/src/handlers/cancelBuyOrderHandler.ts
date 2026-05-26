import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { type AddressValue } from '@summerfi/sdk-common'

export const cancelBuyOrderHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ orderId, userAddress }: { orderId: string; userAddress: AddressValue }) => {
    return sdk.dca.cancelBuyOrder({
      orderId,
      userAddress,
    })
  }
