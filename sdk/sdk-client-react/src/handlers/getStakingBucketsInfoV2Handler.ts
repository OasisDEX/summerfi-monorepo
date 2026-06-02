import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingBucketsInfoV2Handler = (sdk: ISDKManager | ISDKInstiManager) => async () => {
  return sdk.armada.users.getStakingBucketsInfoV2()
}
