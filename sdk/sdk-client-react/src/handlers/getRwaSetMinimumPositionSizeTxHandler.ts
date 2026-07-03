import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, RoundsVaultType } from '@summerfi/sdk-common'

/** @see IRwaManagerClient.getSetMinimumPositionSizeTx */
export const getRwaSetMinimumPositionSizeTxHandler =
  (sdk: ISDKInstiManager) =>
  async ({
    fleetAddress,
    chainId,
    vaultType,
    minimumPositionSize,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    vaultType: RoundsVaultType
    minimumPositionSize: string
  }) => {
    return sdk.rwa.getSetMinimumPositionSizeTx({
      chainId,
      fleetAddress,
      vaultType,
      minimumPositionSize,
    })
  }
