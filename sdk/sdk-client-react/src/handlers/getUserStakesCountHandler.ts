import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { IUser } from '@summerfi/sdk-common'

export const getUserStakesCountHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ user, bucketIndex }: { user: IUser; bucketIndex: number }) => {
    return sdk.armada.users.getUserStakesCount({ user, bucketIndex })
  }
