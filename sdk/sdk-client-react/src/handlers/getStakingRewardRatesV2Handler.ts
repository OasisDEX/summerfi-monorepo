import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { IAddress, IUser } from '@summerfi/sdk-common'

export const getStakingRewardRatesV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ user, rewardTokenAddress }: { user: IUser; rewardTokenAddress: IAddress }) => {
    return sdk.armada.users.getStakingRewardRatesV2({ user, rewardTokenAddress })
  }
