import {
  type EarnAppConfigType,
  type EarnAppFleetCustomConfigType,
  type SDKVaultishType,
} from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'

import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'
import { decorateWithHistoricalChartsData } from '@/helpers/charts/parse-historical-chart-data'

const decorateWithFleetConfig = (
  vaults: SDKVaultishType[],
  fleetMap: EarnAppConfigType['fleetMap'],
) =>
  vaults.map((vault) => {
    const vaultNetworkId = subgraphNetworkToId(vault.protocol.network)
    const vaultNetworkConfig = fleetMap[String(vaultNetworkId) as keyof typeof fleetMap]
    const configCustomFields = vaultNetworkConfig[vault.id.toLowerCase() as '0x']

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return configCustomFields
      ? {
          ...vault,
          customFields: {
            ...vault.customFields,
            ...configCustomFields,
          },
        }
      : vault
  })

export const decorateCustomVaultFields = (
  vaults: SDKVaultishType[],
  systemConfig: Partial<EarnAppConfigType>,
  arkInterestRatesMap?: GetInterestRatesReturnType,
) => {
  const { fleetMap } = systemConfig

  const vaultsWithConfig = fleetMap ? decorateWithFleetConfig(vaults, fleetMap) : vaults

  const vaultsWithChartsData = arkInterestRatesMap
    ? decorateWithHistoricalChartsData(vaultsWithConfig, arkInterestRatesMap)
    : vaultsWithConfig

  return vaultsWithChartsData as SDKVaultishType[]
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
