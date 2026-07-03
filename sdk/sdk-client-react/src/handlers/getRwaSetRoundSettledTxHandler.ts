import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, RoundsVaultType } from '@summerfi/sdk-common'

/** @see IRwaManagerClient.getSetRoundSettledTx */
export const getRwaSetRoundSettledTxHandler =
  (sdk: ISDKInstiManager) =>
  async ({
    fleetAddress,
    chainId,
    vaultType,
    roundId,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    vaultType: RoundsVaultType
    roundId: bigint
  }) => {
    return sdk.rwa.getSetRoundSettledTx({
      chainId,
      fleetAddress,
      vaultType,
      roundId,
    })
  }
