import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingCalculateWeightedStakeV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async (params: { amount: bigint; lockupPeriod: bigint }) => {
    return sdk.armada.users.getStakingCalculateWeightedStakeV2(params)
  }
