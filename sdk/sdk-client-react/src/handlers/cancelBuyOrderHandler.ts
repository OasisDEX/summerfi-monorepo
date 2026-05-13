import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { type AddressValue, type ChainId, User } from '@summerfi/sdk-common'

export const cancelBuyOrderHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    orderId,
    userAddress,
    chainId,
  }: {
    orderId: string
    userAddress: AddressValue
    chainId: ChainId
  }) => {
    const user = User.createFromEthereum(chainId, userAddress)

    return sdk.armada.dca.cancelBuyOrder({
      orderId,
      user,
    })
  }
