import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId, IDcaStrategy } from '@summerfi/sdk-common'

/** @see IDcaManagerClient.resumeStrategyTx */
export const resumeStrategyTxHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({ chainId, strategy }: { chainId: ChainId; strategy: IDcaStrategy }) => {
    return sdk.dca.resumeStrategyTx({
      chainId,
      strategy,
    })
  }
