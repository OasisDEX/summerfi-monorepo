import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingStatsV2Handler = (sdk: ISDKManager | ISDKAdminManager) => async () => {
  return sdk.armada.users.getStakingStatsV2()
}
