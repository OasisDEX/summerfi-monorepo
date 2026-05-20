import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId } from '@summerfi/sdk-common'

export const cancelStrategyTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    chainId,
    strategyId,
  }: {
    chainId: ChainId
    strategyId: string
  }) => {
    return sdk.armada.dca.cancelStrategyTx({
      chainId,
      strategyId,
    })
  }