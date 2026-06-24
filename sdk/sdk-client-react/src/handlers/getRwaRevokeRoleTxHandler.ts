import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, RwaRole } from '@summerfi/sdk-common'

export const getRwaRevokeRoleTxHandler =
  (sdk: ISDKInstiManager) =>
  async ({
    chainId,
    role,
    account,
  }: {
    chainId: ChainId
    role: RwaRole
    account: AddressValue
  }) => {
    return sdk.rwa.getRevokeRoleTx({
      chainId,
      role,
      account,
    })
  }
