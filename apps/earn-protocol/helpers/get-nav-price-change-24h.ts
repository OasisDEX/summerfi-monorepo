import { type GetVaultQueryRwa } from '@summerfi/subgraph-manager-common'
import BigNumber from 'bignumber.js'

/**
 * Computes the day-over-day change of an RWA vault's NAV (pricePerShare) from its daily snapshots.
 *
 * The RWA `GetVault` query requests `dailySnapshots(first: 2, orderBy: timestamp, orderDirection: desc)`,
 * so `[0]` is the latest day and `[1]` is the previous day. The result is a decimal fraction
 * `(latest - previous) / previous` (e.g. `0.0034` = +0.34%) suitable for `formatDecimalAsPercent`.
 *
 * Returns `null` (rendered as "n/a" by the consumer) when there aren't two snapshots, when a price is
 * missing/non-finite, or when the previous price is zero (avoids division by zero).
 */
export const getNavPriceChange24h = (vault: GetVaultQueryRwa['vault']): number | null => {
  const snapshots = vault?.dailySnapshots

  if (!snapshots || snapshots.length < 2) {
    return null
  }

  const latest = Number(snapshots[0]?.pricePerShare)
  const previous = Number(snapshots[1]?.pricePerShare)

  if (!Number.isFinite(latest) || !Number.isFinite(previous) || latest <= 0 || previous <= 0) {
    return null
  }

  return new BigNumber(latest).minus(previous).div(previous).toNumber()
}
