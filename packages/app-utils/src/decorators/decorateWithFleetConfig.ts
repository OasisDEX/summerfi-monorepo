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
    .filter(({ inputTokenBalance }) => {
      if (systemConfig.features?.FilterZeroTokenVaults) {
        return inputTokenBalance > 0
      }

      return true
    })
    .filter(({ customFields, id }) => {
      // we dont want to filter out vaults that user has a position in
      const hasUserPosition = userPositions?.some(
        (position) => position.pool.id.fleetAddress.value.toLowerCase() === id.toLowerCase(),
      )

      // filter disabled (with config) vaults
      return !hasUserPosition && customFields?.disabled ? !customFields.disabled : true
    })
