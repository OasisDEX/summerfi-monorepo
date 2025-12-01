import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue } from '@summerfi/sdk-common'

export const getDelegateTxV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ delegateeAddress }: { delegateeAddress: AddressValue }) => {
    return sdk.armada.users.getDelegateTxV2({ delegateeAddress })
  }
