import type { ISDKAdminManager, ISDKManager, UserStakeV2 } from '@summerfi/sdk-client'

export const getCalculatePenaltyAmountHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    userStakes,
    amounts,
  }: {
    userStakes: UserStakeV2[]
    amounts?: bigint[]
  }): Promise<bigint[]> => {
    const amountsWithDefault = amounts ?? userStakes.map((stake) => stake.amount)
    const userStakesFormatted = userStakes.map((stake) => ({
      lockupEndTime: Number(stake.lockupEndTime),
    }))

    return sdk.armada.users.getCalculatePenaltyAmount({
      userStakes: userStakesFormatted,
      amounts: amountsWithDefault,
    })
  }
