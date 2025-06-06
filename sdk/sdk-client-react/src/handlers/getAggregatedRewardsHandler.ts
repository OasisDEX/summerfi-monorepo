import type { ISDKManager } from '@summer_fi/sdk-client'
import { type IUser } from '@summer_fi/sdk-client'

export const getAggregatedRewardsHandler =
  (sdk: ISDKManager) =>
  async ({ user }: { user: IUser }) => {
    const position = await sdk.armada.users.getAggregatedRewards({
      user,
    })
    return position
  }
