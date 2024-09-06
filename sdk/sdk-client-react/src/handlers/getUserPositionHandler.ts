import type { ISDKManager } from '@summerfi/sdk-client'
import type { IAddress, IUser } from '@summerfi/sdk-common'

export const getUserPositionHandler =
  (sdk: ISDKManager) =>
  ({ user, fleetAddress }: { user: IUser; fleetAddress: IAddress }) =>
    sdk.armada.users
      .getUserPosition({
        user,
        fleetAddress,
      })
      .then((chain) => {
        if (!chain) {
          throw new Error('Chain not found')
        }
        return chain
      })
