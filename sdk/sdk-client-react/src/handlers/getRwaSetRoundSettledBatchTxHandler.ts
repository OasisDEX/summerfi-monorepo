import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, RoundsVaultType } from '@summerfi/sdk-common'

/** @see IRwaManagerClient.getSetRoundSettledBatchTx */
export const getRwaSetRoundSettledBatchTxHandler =
  (sdk: ISDKInstiManager) =>
  async ({
    fleetAddress,
    chainId,
    vaultType,
    roundIds,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    vaultType: RoundsVaultType
    roundIds: bigint[]
  }) => {
    return sdk.rwa.getSetRoundSettledBatchTx({
      chainId,
      fleetAddress,
      vaultType,
      roundIds,
    })
  }
