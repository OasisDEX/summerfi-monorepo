import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, RoundsVaultType } from '@summerfi/sdk-common'

export const getRwaSetMinimumPositionSizeTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
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
