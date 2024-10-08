import type { ISDKManager } from '@summerfi/sdk-client'
import { Address, type IUser } from '@summerfi/sdk-common'

export const getUserPositionHandler =
  (sdk: ISDKManager) =>
  async ({ user, fleetAddress }: { user: IUser; fleetAddress: string }) => {
    const position = await sdk.armada.users.getUserPosition({
      user,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })
    return position
  }
