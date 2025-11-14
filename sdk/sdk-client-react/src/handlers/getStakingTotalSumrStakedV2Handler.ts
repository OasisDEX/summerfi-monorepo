import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingTotalSumrStakedV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) => async () => {
    return sdk.armada.users.getStakingTotalSumrStakedV2()
  }
