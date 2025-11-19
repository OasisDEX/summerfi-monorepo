import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { IArmadaVaultId } from '@summerfi/sdk-common'

/**
 * @name getTipRateHandler
 * @description Gets the tip rate of a fleet vault
 * @param params.vaultId The ID of the vault
 * @returns Promise<bigint> The tip rate as a bigint
 */
export const getTipRateHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ vaultId }: { vaultId: IArmadaVaultId }) => {
    return sdk.armada.admin.tipRate({ vaultId })
  }
