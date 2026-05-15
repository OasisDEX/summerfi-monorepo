import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { type AddressValue, type HexData } from '@summerfi/sdk-common'

export const cancelBuyOrderHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    orderId,
    userAddress,
    signedMessage,
    signature,
  }: {
    orderId: string
    userAddress: AddressValue
    signedMessage: string
    signature: HexData
  }) => {
    return sdk.armada.dca.cancelBuyOrder({
      orderId,
      userAddress,
      signedMessage,
      signature,
    })
  }
