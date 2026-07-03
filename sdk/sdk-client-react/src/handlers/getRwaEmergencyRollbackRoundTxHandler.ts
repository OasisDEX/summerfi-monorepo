import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, RoundsVaultType } from '@summerfi/sdk-common'

/** @see IRwaManagerClient.getEmergencyRollbackRoundTx */
export const getRwaEmergencyRollbackRoundTxHandler =
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
    return sdk.rwa.getEmergencyRollbackRoundTx({
      chainId,
      fleetAddress,
      vaultType,
      roundId,
    })
  }
