import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import { type ChainId } from '@summerfi/sdk-common'

export const getStrategyHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({ chainId, strategyId }: { chainId: ChainId; strategyId: string }) => {
    return sdk.dca.getStrategy({
      chainId,
      strategyId,
    })
  }
