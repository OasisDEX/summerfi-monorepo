import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId, IArmadaDcaStrategyConfig } from '@summerfi/sdk-common'

export const resumeStrategyTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    chainId,
    strategyConfig,
  }: {
    chainId: ChainId
    strategyConfig: IArmadaDcaStrategyConfig
  }) => {
    return sdk.armada.dca.resumeStrategyTx({
      chainId,
      strategyConfig,
    })
  }