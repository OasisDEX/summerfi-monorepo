import type { IChainInfo, ISDKInstiManager } from '@summerfi/sdk-client'
import { Address, ArmadaVaultId, Percentage } from '@summerfi/sdk-common'

/**
 * @name setTipRateHandler
 * @description Sets the tip (management) rate of a fleet vault. The on-chain contract caps the rate
 *   at 5%.
 * @param params.fleetAddress The address of the fleet
 * @param params.chainInfo The chain information
 * @param params.rate The new tip rate in percent units (e.g. 1.5 for 1.5%)
 */
export const setTipRateHandler =
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
    return sdk.armada.admin.setTipRate({
      rate: Percentage.createFrom({ value: rate }),
      vaultId: ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
      }),
    })
  }
