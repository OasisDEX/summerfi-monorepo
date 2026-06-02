import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingTotalWeightedSupplyV2Handler =
  (sdk: ISDKManager | ISDKInstiManager) => async () => {
    return sdk.armada.users.getStakingTotalWeightedSupplyV2()
  }
