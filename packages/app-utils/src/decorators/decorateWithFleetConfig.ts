import {
  type EarnAppConfigType,
  type EarnAppFleetCustomConfigType,
  type IArmadaPosition,
  type SDKVaultishType,
} from '@summerfi/app-types'

import { subgraphNetworkToId, supportedSDKNetwork } from '@/helpers/earn-network-tools'

/**
 * Decorates vault objects with additional configuration from the fleet map
 * @param vaults - Array of vault objects to be decorated
 * @param fleetMap - Configuration map containing network-specific vault settings
 * @returns Array of vaults with merged custom fields from fleet configuration
 */
export const decorateWithFleetConfig = (
  vaults: SDKVaultishType[],
  systemConfig: Partial<EarnAppConfigType>,
  userPositions?: IArmadaPosition[],
  daoManagedVaultsList: `0x${string}`[] = [],
): SDKVaultishType[] =>
  vaults
    .map((vault) => {
      const vaultNetworkId = subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))
      const vaultNetworkConfig =
        systemConfig.fleetMap?.[String(vaultNetworkId) as keyof typeof systemConfig.fleetMap]
      const configCustomFields = vaultNetworkConfig?.[
        vault.id.toLowerCase() as keyof typeof vaultNetworkConfig
      ] as EarnAppFleetCustomConfigType | undefined

      const isDaoManaged = daoManagedVaultsList
        .map((v) => v.toLowerCase())
        .includes(vault.id.toLowerCase() as `0x${string}`)

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      return configCustomFields
        ? {
            ...vault,
            customFields: {
              ...vault.customFields,
              ...configCustomFields,
            },
            isDaoManaged,
          }
        : {
            ...vault,
            isDaoManaged,
          }
    })
    .filter(({ inputTokenBalance, depositCap, customFields, id }) => {
      const hasUserPosition = userPositions?.some(
        // Check if user has a position in this vault
        (position) => position.pool.id.fleetAddress.value.toLowerCase() === id.toLowerCase(),
      )

      if (hasUserPosition) {
        // Don't filter out vaults if user has a position
        return true
      }

      if (systemConfig.features?.FilterZeroTokenVaults && inputTokenBalance <= 0) {
        // Filter zero token vaults if feature is enabled
        return false
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (depositCap !== undefined && depositCap <= 0 && vaults.length > 1) {
        // we want to allow zero deposit cap vaults if they are the only vault available - so the user can get into a vault with known address
        // Filter zero deposit cap vaults
        return false
      }

      if (customFields?.disabled) {
        // Filter disabled vaults
        return false
      }

      return true
    })
