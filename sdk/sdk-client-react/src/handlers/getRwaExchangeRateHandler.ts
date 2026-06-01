import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, RoundsVaultType } from '@summerfi/sdk-common'

export const getRwaExchangeRateHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
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
    return sdk.rwa.getExchangeRate({ chainId, fleetAddress, roundId, vaultType })
  }
