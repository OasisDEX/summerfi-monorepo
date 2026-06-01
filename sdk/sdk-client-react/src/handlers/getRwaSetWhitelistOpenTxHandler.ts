import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaSetWhitelistOpenTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
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
