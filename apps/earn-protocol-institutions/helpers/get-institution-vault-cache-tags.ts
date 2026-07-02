import { type NetworkNames } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'

/**
 * Cache tags to revalidate after an on-chain write against an institution vault, so the server-cached
 * data feeding the panels refreshes.
 *
 * - The per-vault compound tag busts EVERY per-vault cache (vault detail, RWA round positions,
 *   activity, fleet fees, risk parameters) — they all carry this exact tag.
 * - The list tag busts the institution vaults list (TVL, share-price / NAV).
 *
 * The network segment mirrors how the cached wrappers build the tag —
 * `humanNetworktoSDKNetwork(network).toLowerCase()` — so it matches exactly (a bare
 * `institution-vault-<name>` tag, as some panels used, matches nothing and silently leaves stale data).
 */
export const getInstitutionVaultCacheTags = ({
  institutionName,
  vaultAddress,
  network,
}: {
  institutionName: string
  vaultAddress: string
  network: NetworkNames
}): string[] => {
  const lowerName = institutionName.toLowerCase()
  const sdkNetwork = humanNetworktoSDKNetwork(network).toLowerCase()

  return [
    `institution-vault-${lowerName}-${vaultAddress.toLowerCase()}-${sdkNetwork}`,
    `institution-vaults-${lowerName}`,
  ]
}
