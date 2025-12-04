import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingStakesV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async (params?: { first?: number; skip?: number }) => {
    return sdk.armada.users.getStakingStakesV2(params)
  }
