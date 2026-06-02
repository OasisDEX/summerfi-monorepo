import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingTotalSumrStakedV2Handler =
  (sdk: ISDKManager | ISDKInstiManager) => async () => {
    return sdk.armada.users.getStakingTotalSumrStakedV2()
  }
