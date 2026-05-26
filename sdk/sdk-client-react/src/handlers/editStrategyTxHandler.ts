import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId, IDcaStrategy } from '@summerfi/sdk-common'

export const editStrategyTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ chainId, strategy }: { chainId: ChainId; strategy: IDcaStrategy }) => {
    return sdk.dca.editStrategyTx({
      chainId,
      strategy,
    })
  }
