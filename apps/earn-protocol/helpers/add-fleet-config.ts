import { type EarnAppConfigType, type SDKVaultishType } from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'

export const addFleetConfig = (
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
