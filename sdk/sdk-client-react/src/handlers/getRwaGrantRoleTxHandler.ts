import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, RwaRole } from '@summerfi/sdk-common'

/** @see IRwaManagerClient.getGrantRoleTx */
export const getRwaGrantRoleTxHandler =
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
    return sdk.rwa.getGrantRoleTx({
      chainId,
      role,
      account,
    })
  }
