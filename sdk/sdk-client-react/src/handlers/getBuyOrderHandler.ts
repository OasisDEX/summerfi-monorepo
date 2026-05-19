import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { type AddressValue } from '@summerfi/sdk-common'

export const getBuyOrderHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ orderId, userAddress }: { orderId: string; userAddress: AddressValue }) => {
    return sdk.armada.dca.getBuyOrder({
      orderId,
      userAddress,
    })
  }
