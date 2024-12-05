import {
  type EarnAppConfigType,
  type EarnAppFleetCustomConfigType,
  type SDKVaultishType,
} from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'

export const decorateCustomVaultFields = (
  vaults: SDKVaultishType[],
  systemConfig: Partial<EarnAppConfigType>,
) => {
  const { fleetMap } = systemConfig

  if (!fleetMap) {
    return vaults
  }

  return vaults.map((vault) => {
    const vaultNetworkId = subgraphNetworkToId(vault.protocol.network)
    const vaultNetworkConfig = fleetMap[String(vaultNetworkId) as keyof typeof fleetMap]
    const customFields = vaultNetworkConfig[vault.id.toLowerCase() as '0x']

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return customFields
      ? {
          ...vault,
          customFields,
        }
      : vault
  })
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
