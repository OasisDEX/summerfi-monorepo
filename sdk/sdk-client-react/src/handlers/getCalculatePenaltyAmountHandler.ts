import type { ISDKAdminManager, ISDKManager, UserStakeV2 } from '@summerfi/sdk-client'

export const getCalculatePenaltyAmountHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    userStakes,
    amounts,
  }: {
    userStakes: UserStakeV2[]
    amounts: bigint[]
  }): Promise<bigint[]> => {
    return sdk.armada.users.getCalculatePenaltyAmount({ userStakes, amounts })
  }
