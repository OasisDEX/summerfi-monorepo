import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, RoundsVaultType } from '@summerfi/sdk-common'

/** @see IRwaManagerClient.getRoundState */
export const getRwaRoundStateHandler =
  (sdk: ISDKInstiManager) =>
  async ({
    fleetAddress,
    chainId,
    roundId,
    vaultType,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    roundId: bigint
    vaultType: RoundsVaultType
  }) => {
    return sdk.rwa.getRoundState({ chainId, fleetAddress, roundId, vaultType })
  }
