import type { ISDKManager } from '@summer_fi/sdk-client'
import { type IUser } from '@summer_fi/sdk-client'

export const getUserDelegateeHandler =
  (sdk: ISDKManager) =>
  async ({ user }: { user: IUser }) => {
    return sdk.armada.users.getUserDelegatee({ user })
  }
