import type { ISDKManager } from '@summer_fi/sdk-client'
import { Address, type IUser } from '@summer_fi/sdk-client'

export const getUserPositionHandler =
  (sdk: ISDKManager) =>
  async ({ user, fleetAddress }: { user: IUser; fleetAddress: string }) => {
    const position = await sdk.armada.users.getUserPosition({
      user,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })
    return position
  }
