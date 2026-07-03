import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId, IDcaStrategy, IDcaStrategyUpdate } from '@summerfi/sdk-common'

export const editStrategyTxHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({
    chainId,
    strategy,
    update,
  }: {
    chainId: ChainId
    strategy: IDcaStrategy
    update: IDcaStrategyUpdate
  }) => {
    return sdk.dca.editStrategyTx({
      chainId,
      strategy,
      update,
    })
  }
