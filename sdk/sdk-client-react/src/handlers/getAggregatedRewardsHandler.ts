import type { ISDKManager } from '@summerfi/sdk-client'
import { type IUser } from '@summerfi/sdk-common'

export const getAggregatedRewardsHandler =
  (sdk: ISDKManager) =>
  async ({ user }: { user: IUser }) => {
    const position = await sdk.armada.users.getAggregatedRewards({
      user,
    })
    return position
  }
