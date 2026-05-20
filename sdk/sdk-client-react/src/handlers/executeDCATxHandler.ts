import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId, HexData, IArmadaDcaStrategyConfig } from '@summerfi/sdk-common'

export const executeDCATxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    chainId,
    strategyConfig,
    ensoData,
  }: {
    chainId: ChainId
    strategyConfig: IArmadaDcaStrategyConfig
    ensoData: HexData
  }) => {
    return sdk.armada.dca.executeDCATx({
      chainId,
      strategyConfig,
      ensoData,
    })
  }