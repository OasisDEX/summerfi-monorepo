import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaSetWhitelistOpenTxHandler =
  (sdk: ISDKInstiManager) =>
  async ({
    fleetAddress,
    chainId,
    isOpen,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    isOpen: boolean
  }) => {
    return sdk.rwa.getSetWhitelistOpenTx({ chainId, fleetAddress, isOpen })
  }
