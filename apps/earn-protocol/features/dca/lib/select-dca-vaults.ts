import { type SDKVaultishType, type SDKVaultsListType } from '@summerfi/app-types'

import {
  DCA_ALLOWED_PAIRS,
  DCA_SOURCE_TOKEN_SYMBOLS,
  DCA_TARGET_TOKEN_SYMBOLS,
} from './dca-addresses'

const matchesSymbol = (vault: SDKVaultishType, symbols: readonly string[]): boolean => {
  const vaultSymbol = vault.inputToken.symbol.toUpperCase()

  return symbols.some((symbol) => symbol.toUpperCase() === vaultSymbol)
}

const sortByTvlDesc = (a: SDKVaultishType, b: SDKVaultishType): number => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const av = Number(a.totalValueLockedUSD ?? 0)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const bv = Number(b.totalValueLockedUSD ?? 0)

  return bv - av
}

/**
 * Result of resolving the vault universe for the DCA wizard.
 *
 * - `sourceVaults` / `targetVaults` are sorted by TVL desc so the first one
 *   is a sensible default in the wizard.
 * - `pairs` is the explicit allow-list when infra publishes one. When empty
 *   the wizard treats every (source, target) combination as allowed.
 */
export interface DCAVaultSelection {
  sourceVaults: SDKVaultsListType
  targetVaults: SDKVaultsListType
  pairs: { fromVaultId: string; toVaultId: string }[]
}

/**
 * Pick the source/target vault universe for the DCA wizard out of the
 * full list returned by `getCachedVaultsList()`.
 *
 * If `DCA_ALLOWED_PAIRS` is non-empty we restrict to that allow-list,
 * otherwise we fall back to "any USDC-ish vault → any ETH-ish vault" so
 * the UI is testable before infra ships the on-chain pair registry.
 */
export const selectDCAVaults = (vaults: SDKVaultsListType): DCAVaultSelection => {
  if (DCA_ALLOWED_PAIRS.length > 0) {
    const byId = new Map(vaults.map((vault) => [vault.id.toLowerCase(), vault] as const))

    const sourceVaultIds = new Set<string>()
    const targetVaultIds = new Set<string>()
    const resolvedPairs: DCAVaultSelection['pairs'] = []

    for (const pair of DCA_ALLOWED_PAIRS) {
      const from = byId.get(pair.fromVaultId.toLowerCase())
      const to = byId.get(pair.toVaultId.toLowerCase())

      // eslint-disable-next-line no-continue
      if (!from || !to) continue
      sourceVaultIds.add(from.id)
      targetVaultIds.add(to.id)
      resolvedPairs.push({ fromVaultId: from.id, toVaultId: to.id })
    }

    return {
      sourceVaults: vaults.filter((vault) => sourceVaultIds.has(vault.id)).sort(sortByTvlDesc),
      targetVaults: vaults.filter((vault) => targetVaultIds.has(vault.id)).sort(sortByTvlDesc),
      pairs: resolvedPairs,
    }
  }

  return {
    sourceVaults: vaults
      .filter((vault) => matchesSymbol(vault, DCA_SOURCE_TOKEN_SYMBOLS))
      .sort(sortByTvlDesc),
    targetVaults: vaults
      .filter((vault) => matchesSymbol(vault, DCA_TARGET_TOKEN_SYMBOLS))
      .sort(sortByTvlDesc),
    pairs: [],
  }
}

/**
 * Returns whether the (from → to) pair is allowed by the current DCA
 * configuration. When no explicit pair list is provided every combination
 * is considered allowed.
 */
export const isPairAllowed = (
  pairs: DCAVaultSelection['pairs'],
  fromVaultId: string,
  toVaultId: string,
): boolean => {
  if (pairs.length === 0) return true

  return pairs.some(
    (pair) =>
      pair.fromVaultId.toLowerCase() === fromVaultId.toLowerCase() &&
      pair.toVaultId.toLowerCase() === toVaultId.toLowerCase(),
  )
}
