import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import type { IUser } from '@summerfi/sdk-common'

export const getUserStakesV2Handler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({ user }: { user: IUser }) => {
    return sdk.armada.users.getUserStakesV2({ user })
  }
