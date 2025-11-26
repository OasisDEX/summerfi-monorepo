import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'

/**
 * @name getStakingConfigV2Handler
 * @description Returns the staking configuration including the staking contract address
 */
export const getStakingConfigV2Handler = (sdk: ISDKManager | ISDKAdminManager) => async () => {
  return sdk.armada.users.getStakingConfigV2()
}
