import {
  type EarnAppConfigType,
  type EarnAppFleetCustomConfigType,
  type SDKVaultishType,
  SupportedNetworkIds,
} from '@summerfi/app-types'

/**
 * Networks on which the RWA (institutions-v2) subgraph is deployed. Mirrors the earn-protocol
 * `rwaSubgraphsMap` (Mainnet + Base), which is the canonical source there. RWA vaults for an
 * institution are fetched per network from this list.
 */
export const rwaSupportedNetworkIds = [SupportedNetworkIds.Mainnet, SupportedNetworkIds.Base]

/**
 * Returns the fleet-config custom fields for a vault if it is configured (by address) on the given
 * network, else undefined. RWA vaults are exactly those whose config carries a `vaultCurator` — the
 * same signal `decorateWithFleetConfig` uses to set `isRwaVault`.
 */
export const getVaultConfigCustomFields = ({
  systemConfig,
  networkId,
  vaultAddress,
}: {
  systemConfig: Partial<EarnAppConfigType>
  networkId: number
  vaultAddress: string
}): EarnAppFleetCustomConfigType | undefined => {
  const networkConfig =
    systemConfig.fleetMap?.[String(networkId) as keyof typeof systemConfig.fleetMap]

  return networkConfig?.[vaultAddress.toLowerCase() as keyof typeof networkConfig] as
    | EarnAppFleetCustomConfigType
    | undefined
}

/**
 * Whether a vault (by address + network) is an RWA vault, determined from the fleet config.
 */
export const isRwaVaultByConfig = (params: {
  systemConfig: Partial<EarnAppConfigType>
  networkId: number
  vaultAddress: string
}): boolean => !!getVaultConfigCustomFields(params)?.vaultCurator

/**
 * Decorates raw RWA subgraph vaults with their fleet-config custom fields and the `isRwaVault` flag,
 * dropping any flagged `disabled` in config. Deliberately does NOT apply the zero-cap / zero-balance
 * filtering that `decorateWithFleetConfig` does — a newly-launched RWA vault can legitimately have a
 * zero buffer balance and must still surface for management.
 */
export const decorateRwaVaults = ({
  vaults,
  systemConfig,
  networkId,
}: {
  vaults: SDKVaultishType[]
  systemConfig: Partial<EarnAppConfigType>
  networkId: number
}): SDKVaultishType[] =>
  vaults
    .map((vault) => {
      const configCustomFields = getVaultConfigCustomFields({
        systemConfig,
        networkId,
        vaultAddress: vault.id,
      })

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      return configCustomFields
        ? {
            ...vault,
            customFields: {
              ...vault.customFields,
              ...configCustomFields,
            },
            isDaoManaged: false,
            isRwaVault: !!configCustomFields.vaultCurator,
          }
        : {
            ...vault,
            isDaoManaged: false,
            isRwaVault: false,
          }
    })
    .filter((vault) => !vault.customFields?.disabled)
