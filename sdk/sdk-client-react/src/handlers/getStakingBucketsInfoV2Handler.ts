import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingBucketsInfoV2Handler = (sdk: ISDKManager | ISDKAdminManager) => async () => {
  return sdk.armada.users.getStakingBucketsInfoV2()
}
