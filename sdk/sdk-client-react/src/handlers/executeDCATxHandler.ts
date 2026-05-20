import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, IArmadaDcaOrder } from '@summerfi/sdk-common'

export const executeDCATxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    chainId,
    order,
    strategyId,
    inAssetFeed,
    outAssetFeed,
  }: {
    chainId: ChainId
    order: IArmadaDcaOrder
    strategyId: string
    inAssetFeed: AddressValue
    outAssetFeed: AddressValue
  }) => {
    return sdk.armada.dca.executeDCATx({
      chainId,
      order,
      strategyId,
      inAssetFeed,
      outAssetFeed,
    })
  }
