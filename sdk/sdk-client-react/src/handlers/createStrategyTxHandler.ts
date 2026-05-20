import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, IArmadaDcaOrder } from '@summerfi/sdk-common'

export const createStrategyTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    chainId,
    order,
    inAssetFeed,
    outAssetFeed,
  }: {
    chainId: ChainId
    order: IArmadaDcaOrder
    inAssetFeed: AddressValue
    outAssetFeed: AddressValue
  }) => {
    return sdk.armada.dca.createStrategyTx({
      chainId,
      order,
      inAssetFeed,
      outAssetFeed,
    })
  }
