import type { IChainInfo, ISDKInstiManager } from '@summerfi/sdk-client'
import { Address, ArmadaVaultId, Percentage } from '@summerfi/sdk-common'

/**
 * Sets the maximum deposit percentage of TVL for an ark
 *
 * @param params.arkAddress The address of the ark
 * @param params.fleetAddress The address of the fleet
 * @param params.chainInfo The chain information
 * @param params.maxDepositPercentage The new maximum deposit percentage
 */
export const setArkMaxDepositPercentageOfTVLHandler =
  (sdk: ISDKInstiManager) =>
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
