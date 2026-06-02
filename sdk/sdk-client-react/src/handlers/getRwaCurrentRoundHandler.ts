import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, RoundsVaultType } from '@summerfi/sdk-common'

export const getRwaCurrentRoundHandler =
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
    return sdk.rwa.getCurrentRound({ chainId, fleetAddress, vaultType })
  }
