import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { IArmadaVaultId } from '@summerfi/sdk-common'

/**
 * Gets the tip rate of a fleet vault
 *
 * @param params.vaultId The ID of the vault
 * @returns Promise<bigint> The tip rate as a bigint
 */
export const getTipRateHandler =
  (sdk: ISDKInstiManager) =>
  async ({ vaultId }: { vaultId: IArmadaVaultId }) => {
    return sdk.armada.admin.tipRate({ vaultId })
  }
