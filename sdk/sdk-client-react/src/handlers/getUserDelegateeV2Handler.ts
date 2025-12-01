import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue } from '@summerfi/sdk-common'

export const getUserDelegateeV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ userAddress }: { userAddress: AddressValue }) => {
    return sdk.armada.users.getUserDelegateeV2({ userAddress })
  }
