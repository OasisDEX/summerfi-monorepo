import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId, IArmadaDcaOrder } from '@summerfi/sdk-common'

export const resumeStrategyTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    chainId,
    order,
    strategyId,
  }: {
    chainId: ChainId
    order: IArmadaDcaOrder
    strategyId: string
  }) => {
    return sdk.dca.resumeStrategyTx({
      chainId,
      order,
      strategyId,
    })
  }
