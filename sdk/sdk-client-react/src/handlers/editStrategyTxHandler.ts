import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId, IDcaStrategy } from '@summerfi/sdk-common'

export const editStrategyTxHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({ chainId, strategy }: { chainId: ChainId; strategy: IDcaStrategy }) => {
    return sdk.dca.editStrategyTx({
      chainId,
      strategy,
    })
  }
