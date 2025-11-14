import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { IAddress, IUser } from '@summerfi/sdk-common'

export const getUserStakingEarnedV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ user, rewardTokenAddress }: { user: IUser; rewardTokenAddress: IAddress }) => {
    return sdk.armada.users.getUserStakingEarnedV2({ user, rewardTokenAddress })
  }
