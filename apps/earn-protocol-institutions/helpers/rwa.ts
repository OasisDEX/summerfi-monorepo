import {
  type EarnAppConfigType,
  type EarnAppFleetCustomConfigType,
  type SDKVaultishType,
  SupportedNetworkIds,
} from '@summerfi/app-types'
import { humanNetworktoSDKNetwork, subgraphNetworkToSDKId } from '@summerfi/app-utils'

/**
 * Networks on which the RWA (institutions-v2) subgraph is deployed. Mirrors the earn-protocol
 * `rwaSubgraphsMap` (Mainnet + Base), which is the canonical source there. RWA vaults for an
 * institution are fetched per network from this list.
 */
export const rwaSupportedNetworkIds = [SupportedNetworkIds.Mainnet, SupportedNetworkIds.Base]

/**
 * Resolves a vault-detail route network *slug* (e.g. `mainnet`, `base`) to a chain id. The route
 * segments use SDK network slugs, which diverge from the `NetworkNames` enum for Ethereum (slug
 * `mainnet` vs enum value `ethereum`), so `networkNameToSDKId` returns `undefined` for mainnet —
 * crashing any RWA panel that feeds the chain id to a `TransactionQueue`. Going through the SDK
 * network (`humanNetworktoSDKNetwork` → `subgraphNetworkToSDKId`) maps every slug correctly, and is
 * the same resolution the server-side RWA fetchers already use.
 */
export const urlNetworkToChainId = (network: string): SupportedNetworkIds =>
  subgraphNetworkToSDKId(humanNetworktoSDKNetwork(network))

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
 * The RWA SDK clientId for a vault — its `vaultInstitutionId` fleet-config field (NOT the institution
 * name). RWA SDK calls must run on the instance whose clientId owns the vault. Returns undefined for
 * non-RWA / unconfigured vaults.
 */
export const getRwaClientIdForVault = (params: {
  systemConfig: Partial<EarnAppConfigType>
  networkId: number
  vaultAddress: string
}): string | undefined => getVaultConfigCustomFields(params)?.vaultInstitutionId

/**
 * Determines whether an RWA vault's `vaultInstitutionId` clientId belongs to the given institution.
 * The clientId IS the institution's DB `name`, matched EXACTLY. Suffixed names like `ExtDemoCorp_v2`
 * and `ExtDemoCorp_3` are their OWN distinct institutions (each a separate DB row with its own
 * dashboard), not sub-accounts of a shorter-named one — so a prefix match leaks their vaults into
 * `ExtDemoCorp`'s list. Every RWA clientId in the config is an exact institution name.
 */
const rwaClientIdBelongsToInstitution = (clientId: string, institutionName: string): boolean =>
  clientId === institutionName

/**
 * The institution's RWA `(clientId, networkId)` pairs, derived from the fleet config's per-chain
 * buckets — exactly how the earn-protocol app does it (`getRwaClientIdsForChain` over `fleetMap[chainId]`).
 *
 * The chain pairing comes from which chain bucket a vault's config lives in, so each RWA clientId is
 * fetched ONLY on the chain(s) it's configured for. This is the fix for duplicate vaults: the previous
 * approach cross-producted every clientId against every RWA network, and since the SDK resolves the
 * subgraph from the Client-Id, a clientId's vaults came back once per network iteration. Pairing each
 * clientId with its own chain queries each set exactly once.
 *
 * Only RWA-supported chains are considered; disabled / non-RWA entries and other institutions are
 * skipped. Pairs are deduped by `clientId-networkId`.
 */
export const getInstitutionRwaClientChainPairs = ({
  systemConfig,
  institutionName,
}: {
  systemConfig: Partial<EarnAppConfigType>
  institutionName: string
}): { clientId: string; networkId: number }[] => {
  const fleetMap = systemConfig.fleetMap ?? {}
  const seen = new Set<string>()
  const pairs: { clientId: string; networkId: number }[] = []

  for (const [chainKey, networkConfig] of Object.entries(
    fleetMap as { [key: string]: { [key: string]: EarnAppFleetCustomConfigType } },
  )) {
    const networkId = Number(chainKey)

    // Only chains where the RWA (institutions-v2) subgraph is deployed.
    if (rwaSupportedNetworkIds.includes(networkId as SupportedNetworkIds)) {
      for (const entry of Object.values(networkConfig)) {
        const clientId = entry.vaultInstitutionId
        const key = `${clientId}-${networkId}`

        if (
          entry.vaultCurator &&
          !entry.disabled &&
          clientId &&
          rwaClientIdBelongsToInstitution(clientId, institutionName) &&
          !seen.has(key)
        ) {
          seen.add(key)
          pairs.push({ clientId, networkId })
        }
      }
    }
  }

  return pairs
}

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
