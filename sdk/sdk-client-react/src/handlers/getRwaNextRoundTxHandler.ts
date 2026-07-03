import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, RoundsVaultType } from '@summerfi/sdk-common'

/** @see IRwaManagerClient.getNextRoundTx */
export const getRwaNextRoundTxHandler =
  (sdk: ISDKInstiManager) =>
  async ({
    fleetAddress,
    chainId,
    vaultType,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    vaultType: RoundsVaultType
  }) => {
    return sdk.rwa.getNextRoundTx({
      chainId,
      fleetAddress,
      vaultType,
    })
  }
