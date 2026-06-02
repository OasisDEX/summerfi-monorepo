import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import { type IUser } from '@summerfi/sdk-common'

export const getUserStakedBalanceHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({ user }: { user: IUser }) => {
    return sdk.armada.users.getUserStakedBalance({ user })
  }
