import type { IChainInfo, ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { Address, ArmadaVaultId, Percentage } from '@summerfi/sdk-common'

/**
 * @name setArkMaxDepositPercentageOfTVLHandler
 * @description Sets the maximum deposit percentage of TVL for an ark
 * @param params.vaultId The ID of the vault
 * @param params.ark The address of the ark
 * @param params.maxDepositPercentageOfTVL The new maximum deposit percentage of TVL
 */
export const setArkMaxDepositPercentageOfTVLHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    arkAddress,
    fleetAddress,
    chainInfo,
    maxDepositPercentage,
  }: {
    arkAddress: string
    fleetAddress: string
    chainInfo: IChainInfo
    maxDepositPercentage: number
  }) => {
    return sdk.armada.admin.setArkMaxDepositPercentageOfTVL({
      ark: Address.createFromEthereum({ value: arkAddress }),
      vaultId: ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
      }),
      maxDepositPercentageOfTVL: Percentage.createFrom({ value: maxDepositPercentage }),
    })
  }
