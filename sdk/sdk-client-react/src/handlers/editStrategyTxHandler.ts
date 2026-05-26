import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId, IDcaStrategy } from '@summerfi/sdk-common'

export const editStrategyTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    chainId,
    strategy,
    strategyId,
  }: {
    chainId: ChainId
    strategy: IDcaStrategy
    strategyId: string
  }) => {
    return sdk.dca.editStrategyTx({
      chainId,
      strategy,
      strategyId,
    })
  }
