import type { IChainInfo, ISDKInstiManager } from '@summerfi/sdk-client'
import { Address, ArmadaVaultId, Percentage } from '@summerfi/sdk-common'

/**
 * Sets the performance fee rate of a fleet vault. The on-chain contract enforces a
 * non-zero rate and rejects rates above its maximum.
 *
 * @param params.fleetAddress The address of the fleet
 * @param params.chainInfo The chain information
 * @param params.rate The new performance fee rate in percent units (e.g. 1.5 for 1.5%)
 */
export const setPerformanceFeeRateHandler =
  (sdk: ISDKInstiManager) =>
  async ({
    rate,
    fleetAddress,
    chainInfo,
  }: {
    fleetAddress: string
    rate: number
    chainInfo: IChainInfo
  }) => {
    return sdk.armada.admin.setPerformanceFeeRate({
      rate: Percentage.createFrom({ value: rate }),
      vaultId: ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
      }),
    })
  }
