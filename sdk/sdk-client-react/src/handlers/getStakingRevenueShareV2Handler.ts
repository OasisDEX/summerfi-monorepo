import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingRevenueShareV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) => async () => {
    return sdk.armada.users.getStakingRevenueShareV2()
  }
