import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingStakesV2Handler =
  (sdk: ISDKManager | ISDKInstiManager) => async (params?: { first?: number; skip?: number }) => {
    return sdk.armada.users.getStakingStakesV2(params)
  }
