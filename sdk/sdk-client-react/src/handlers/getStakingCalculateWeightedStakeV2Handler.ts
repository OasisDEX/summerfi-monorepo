import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingCalculateWeightedStakeV2Handler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async (params: { amount: bigint; lockupPeriod: bigint }) => {
    return sdk.armada.users.getStakingCalculateWeightedStakeV2(params)
  }
