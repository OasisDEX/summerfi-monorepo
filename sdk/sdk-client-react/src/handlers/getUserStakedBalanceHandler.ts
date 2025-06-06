import type { ISDKManager } from '@summer_fi/sdk-client'
import { type IUser } from '@summer_fi/sdk-client'

export const getUserStakedBalanceHandler =
  (sdk: ISDKManager) =>
  async ({ user }: { user: IUser }) => {
    return sdk.armada.users.getUserStakedBalance({ user })
  }
