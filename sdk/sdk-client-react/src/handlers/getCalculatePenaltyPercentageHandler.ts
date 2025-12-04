import type { ISDKAdminManager, ISDKManager, UserStakeV2, IPercentage } from '@summerfi/sdk-client'

export const getCalculatePenaltyPercentageHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ userStakes }: { userStakes: UserStakeV2[] }): Promise<IPercentage[]> => {
    return sdk.armada.users.getCalculatePenaltyPercentage({ userStakes })
  }
