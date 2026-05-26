import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId } from '@summerfi/sdk-common'

export const pauseStrategyTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ chainId, strategyId }: { chainId: ChainId; strategyId: string }) => {
    return sdk.dca.pauseStrategyTx({
      chainId,
      strategyId,
    })
  }
