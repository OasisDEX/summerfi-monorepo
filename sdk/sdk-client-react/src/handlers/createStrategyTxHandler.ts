import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId, IArmadaDcaStrategyConfig } from '@summerfi/sdk-common'

export const createStrategyTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    chainId,
    strategyConfig,
  }: {
    chainId: ChainId
    strategyConfig: IArmadaDcaStrategyConfig
  }) => {
    return sdk.armada.dca.createStrategyTx({
      chainId,
      strategyConfig,
    })
  }