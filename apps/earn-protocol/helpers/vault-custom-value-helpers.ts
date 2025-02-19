import {
  type EarnAppConfigType,
  type EarnAppFleetCustomConfigType,
  type ForecastData,
  type IArmadaPosition,
  type SDKVaultishType,
} from '@summerfi/app-types'
import { decorateWithFleetConfig } from '@summerfi/app-utils'

import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'
import { type GetPositionHistoryReturnType } from '@/app/server-handlers/position-history'
import { decorateWithArkInterestRatesData } from '@/helpers/vault-decorators/ark-interest-data'
import { decorateWithArkHistoricalChartsData } from '@/helpers/vault-decorators/chart-ark-historical-data'
import { decorateWithHistoryChartData } from '@/helpers/vault-decorators/chart-historical-data'
import { decorateWithPerformanceChartData } from '@/helpers/vault-decorators/chart-performance-data'

type VaultDecoratorsType = {
  // vaults will be a list of vaults if its just config, or a single vault if its decorators
  vaults: SDKVaultishType[]
  position?: IArmadaPosition
  systemConfig: Partial<EarnAppConfigType>
  decorators?: {
    arkInterestRatesMap?: GetInterestRatesReturnType
    positionHistory?: GetPositionHistoryReturnType
    positionForecast?: ForecastData
  }
}

export const decorateCustomVaultFields = ({
  vaults,
  position,
  systemConfig,
  decorators,
}: VaultDecoratorsType) => {
  const { fleetMap } = systemConfig
  const { arkInterestRatesMap, positionHistory, positionForecast } = decorators ?? {}

  const vaultsWithConfig = fleetMap ? decorateWithFleetConfig(vaults, fleetMap) : vaults

  const vaultsWithChartsData = arkInterestRatesMap
    ? decorateWithArkHistoricalChartsData(vaultsWithConfig, arkInterestRatesMap)
    : vaultsWithConfig

  const vaultsWithArkInterestRates = arkInterestRatesMap
    ? decorateWithArkInterestRatesData(vaultsWithChartsData, arkInterestRatesMap)
    : vaultsWithChartsData

  const vaultsWithPerformanceChartData =
    positionHistory && positionForecast
      ? decorateWithPerformanceChartData(vaultsWithArkInterestRates, {
          position,
          positionHistory,
          positionForecast,
        })
      : vaultsWithArkInterestRates

  const vaultsWithHistoryChartData = positionHistory
    ? decorateWithHistoryChartData(vaultsWithPerformanceChartData, {
        position,
        positionHistory,
      })
    : vaultsWithArkInterestRates

  return vaultsWithHistoryChartData as SDKVaultishType[]
}

export const getCustomVaultConfigById = (
  vaultId: string,
  networkId: string,
  systemConfig: Partial<EarnAppConfigType>,
) => {
  const { fleetMap } = systemConfig

  if (!fleetMap) {
    return ''
  }
  const vaultNetworkConfig = fleetMap[String(networkId) as keyof typeof fleetMap]
  const customFields = Object.values(vaultNetworkConfig).find(
    (fleet) => fleet.address === vaultId,
  ) as EarnAppFleetCustomConfigType | undefined

  if (!customFields?.name) {
    // eslint-disable-next-line no-console
    console.log(`No vault found with the ud ${vaultId} on the network ${networkId}`)

    return ''
  }

  return customFields
}

export const getVaultIdByVaultCustomName = (
  vaultCustomName: string,
  networkId: string,
  systemConfig: Partial<EarnAppConfigType>,
) => {
  const { fleetMap } = systemConfig

  if (!fleetMap) {
    return ''
  }
  const vaultNetworkConfig = fleetMap[String(networkId) as keyof typeof fleetMap]
  const customFields = Object.values(vaultNetworkConfig).find(
    (fleet) => fleet.slug === vaultCustomName,
  ) as EarnAppFleetCustomConfigType | undefined

  if (!customFields?.address) {
    // eslint-disable-next-line no-console
    console.log(`No vault found with the name ${vaultCustomName} on the network ${networkId}`)

    return ''
  }

  return customFields.address
}
