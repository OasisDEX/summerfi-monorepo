import type { ArmadaDcaOrderStatusEnum, ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { type AddressValue, type ChainId } from '@summerfi/sdk-common'

export const getBuyOrdersHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    userAddress,
    chainId,
    status,
  }: {
    userAddress: AddressValue
    chainId: ChainId
    status?: ArmadaDcaOrderStatusEnum
  }) => {
    return sdk.armada.dca.getBuyOrders({
      chainId,
      userAddress,
      status,
    })
  }
