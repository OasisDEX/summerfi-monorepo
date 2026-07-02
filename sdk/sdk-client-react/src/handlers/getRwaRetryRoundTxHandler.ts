import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, RoundsVaultType } from '@summerfi/sdk-common'

export const getRwaRetryRoundTxHandler =
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
    return sdk.rwa.getRetryRoundTx({
      chainId,
      fleetAddress,
      vaultType,
      roundId,
    })
  }
