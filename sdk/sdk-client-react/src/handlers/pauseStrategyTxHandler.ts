import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId, IDcaStrategy } from '@summerfi/sdk-common'

export const pauseStrategyTxHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({ chainId, strategy }: { chainId: ChainId; strategy: IDcaStrategy }) => {
    return sdk.dca.pauseStrategyTx({
      chainId,
      strategy,
    })
  }
