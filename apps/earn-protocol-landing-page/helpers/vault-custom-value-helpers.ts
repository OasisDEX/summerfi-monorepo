import { type EarnAppConfigType, type SDKVaultishType } from '@summerfi/app-types'
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

    return customFields
      ? {
          ...vault,
          customFields,
        }
      : vault
  })
}
