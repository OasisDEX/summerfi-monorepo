import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingTotalWeightedSupplyV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) => async () => {
    return sdk.armada.users.getStakingTotalWeightedSupplyV2()
  }
