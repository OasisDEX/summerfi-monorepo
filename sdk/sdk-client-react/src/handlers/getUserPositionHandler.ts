import type { ISDKManager } from '@summerfi/sdk-client'
import type { IAddress, IUser } from '@summerfi/sdk-common'

export const getUserPositionHandler =
  (sdk: ISDKManager) =>
  async ({ user, fleetAddress }: { user: IUser; fleetAddress: IAddress }) => {
    const position = await sdk.armada.users.getUserPosition({
      user,
      fleetAddress,
    })
    return position
  }
