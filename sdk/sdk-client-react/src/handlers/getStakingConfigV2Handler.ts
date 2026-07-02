import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'

/**
 * Returns the staking configuration including the staking contract address
 */
export const getStakingConfigV2Handler = (sdk: ISDKManager | ISDKInstiManager) => async () => {
  return sdk.armada.users.getStakingConfigV2()
}
