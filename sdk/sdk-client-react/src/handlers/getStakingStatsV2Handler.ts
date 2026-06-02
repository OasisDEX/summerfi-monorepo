import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingStatsV2Handler = (sdk: ISDKManager | ISDKInstiManager) => async () => {
  return sdk.armada.users.getStakingStatsV2()
}
