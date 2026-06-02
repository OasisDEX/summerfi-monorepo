import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingRevenueShareV2Handler =
  (sdk: ISDKManager | ISDKInstiManager) => async () => {
    return sdk.armada.users.getStakingRevenueShareV2()
  }
