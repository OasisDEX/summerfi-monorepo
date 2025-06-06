import type { ISDKManager } from '@summer_fi/sdk-client'
import { type IUser } from '@summer_fi/sdk-client'

export const getClaimableAggregatedRewardsHandler =
  (sdk: ISDKManager) =>
  async ({ user }: { user: IUser }) => {
    const position = await sdk.armada.users.getClaimableAggregatedRewards({
      user,
    })
    return position
  }
