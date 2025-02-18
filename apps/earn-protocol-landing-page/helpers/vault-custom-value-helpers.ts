import { type EarnAppConfigType, type SDKVaultishType } from '@summerfi/app-types'
import { decorateWithFleetConfig } from '@summerfi/app-utils'

import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'

import { decorateWithArkInterestRatesData } from './vault-decorators/ark-interest-data'

export const decorateCustomVaultFields = ({
  vaults,
  systemConfig,
  decorators,
}: {
  vaults: SDKVaultishType[]
  systemConfig: Partial<EarnAppConfigType>
  decorators?: {
    arkInterestRatesMap?: GetInterestRatesReturnType
  }
}) => {
  const { fleetMap } = systemConfig

  const { arkInterestRatesMap } = decorators ?? {}

  const vaultsWithConfig = fleetMap ? decorateWithFleetConfig(vaults, fleetMap) : vaults

  const vaultsWithArkInterestRates = arkInterestRatesMap
    ? decorateWithArkInterestRatesData(vaultsWithConfig, arkInterestRatesMap)
    : vaultsWithConfig

  return vaultsWithArkInterestRates as SDKVaultishType[]
}
