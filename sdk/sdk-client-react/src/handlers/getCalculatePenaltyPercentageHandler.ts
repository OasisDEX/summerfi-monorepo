import type { ISDKInstiManager, ISDKManager, UserStakeV2, IPercentage } from '@summerfi/sdk-client'

export const getCalculatePenaltyPercentageHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({ userStakes }: { userStakes: UserStakeV2[] }): Promise<IPercentage[]> => {
    const userStakesFormatted = userStakes.map((stake) => ({
      lockupEndTime: Number(stake.lockupEndTime),
    }))
    return sdk.armada.users.getCalculatePenaltyPercentage({ userStakes: userStakesFormatted })
  }
