import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import { Address, type IUser } from '@summerfi/sdk-common'

export const getUserPositionHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({ user, fleetAddress }: { user: IUser; fleetAddress: string }) => {
    const position = await sdk.armada.users.getUserPosition({
      user,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })
    return position
  }
