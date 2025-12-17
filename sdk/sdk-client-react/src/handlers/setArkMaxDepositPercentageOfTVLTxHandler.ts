import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { IAddress, IArmadaVaultId, IPercentage } from '@summerfi/sdk-common'

/**
 * @name setArkMaxDepositPercentageOfTVLTxHandler
 * @description Sets the maximum deposit percentage of TVL for an ark
 * @param params.vaultId The ID of the vault
 * @param params.ark The address of the ark
 * @param params.maxDepositPercentageOfTVL The new maximum deposit percentage of TVL
 */
export const setArkMaxDepositPercentageOfTVLTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    vaultId,
    ark,
    maxDepositPercentageOfTVL,
  }: {
    vaultId: IArmadaVaultId
    ark: IAddress
    maxDepositPercentageOfTVL: IPercentage
  }) => {
    return sdk.armada.admin.setArkMaxDepositPercentageOfTVL({
      vaultId,
      ark,
      maxDepositPercentageOfTVL,
    })
  }
