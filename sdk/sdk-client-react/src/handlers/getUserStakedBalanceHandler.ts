import type { ISDKManager } from '@summerfi/sdk-client'
import { type IUser } from '@summerfi/sdk-common'

export const getUserStakedBalanceHandler =
  (sdk: ISDKManager) =>
  async ({ user }: { user: IUser }) => {
    return sdk.armada.users.getUserStakedBalance({ user })
  }
