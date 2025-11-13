import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingRevenueAmountV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) => async () => {
    return sdk.armada.users.getStakingRevenueAmountV2()
  }
