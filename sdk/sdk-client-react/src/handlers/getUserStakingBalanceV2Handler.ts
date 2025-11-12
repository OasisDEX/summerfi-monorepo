import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { IUser } from '@summerfi/sdk-common'

export const getUserStakingBalanceV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ user }: { user: IUser }) => {
    return sdk.armada.users.getUserStakingBalanceV2({ user })
  }
