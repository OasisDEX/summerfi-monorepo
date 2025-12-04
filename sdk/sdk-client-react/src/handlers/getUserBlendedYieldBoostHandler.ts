import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { IUser } from '@summerfi/sdk-common'

export const getUserBlendedYieldBoostHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ user }: { user: IUser }) => {
    return sdk.armada.users.getUserBlendedYieldBoost({ user })
  }
