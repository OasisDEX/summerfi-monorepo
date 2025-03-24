import { type EarnAppConfigType, type SDKVaultishType } from '@summerfi/app-types'

import { subgraphNetworkToId } from '@/helpers/earn-network-tools'

/**
 * Decorates vault objects with additional configuration from the fleet map
 * @param vaults - Array of vault objects to be decorated
 * @param fleetMap - Configuration map containing network-specific vault settings
 * @returns Array of vaults with merged custom fields from fleet configuration
 */
export const decorateWithFleetConfig = (
  vaults: SDKVaultishType[],
  fleetMap: EarnAppConfigType['fleetMap'],
) =>
  vaults
    .map((vault) => {
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
    .filter(({ customFields }) => {
      // filter disabled (with config) vaults
      return customFields?.disabled ? !customFields.disabled : true
    })
