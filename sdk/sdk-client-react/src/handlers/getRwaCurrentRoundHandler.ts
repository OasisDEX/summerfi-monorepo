import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, RoundsVaultType } from '@summerfi/sdk-common'

export const getRwaCurrentRoundHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
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
