import BigNumber from 'bignumber.js'

const SECONDS_PER_DAY = 86_400
const DAYS_PER_YEAR = 365

// Default staleness threshold: a vault's newest daily snapshot older than this (relative to the subgraph's
// latest indexed block) is considered stale. Daily snapshots are produced ~once/day, so 1 day is the
// tightest sensible bound — a healthy but low-activity vault can legitimately sit near this.
export const DEFAULT_STALENESS_THRESHOLD_SECONDS = SECONDS_PER_DAY

// A vault daily snapshot as returned by the subgraph. The Graph serialises BigDecimal/BigInt scalars as JSON
// strings, so both fields arrive as strings. Snapshots are expected newest-first (orderDirection: desc).
export interface NavSnapshot {
  pricePerShare: string | null
  timestamp: string
}

export interface NavStaleness {
  /** true when the newest snapshot is missing, has a bad timestamp, or is older than `thresholdSeconds`. */
  isStale: boolean
  /** unix seconds of the newest daily snapshot, or null when there are none / it is non-finite. */
  latestSnapshotTimestamp: number | null
  /** referenceTimestamp - latestSnapshotTimestamp (how old the newest snapshot is), or null when unavailable. */
  ageSeconds: number | null
  /** the staleness threshold applied, in seconds. */
  thresholdSeconds: number
  /** the subgraph's latest indexed block number (from `_meta`), or null when unavailable. */
  subgraphBlockNumber: number | null
  /** the subgraph's latest indexed block timestamp (from `_meta`) — the reference "now" used, or null. */
  subgraphBlockTimestamp: number | null
}

/**
 * Computes staleness of a vault's NAV data from its daily snapshots. The reference "now" is the subgraph's
 * latest indexed block timestamp (`_meta.block.timestamp`) — comparing against the subgraph's own head avoids
 * Lambda/chain clock skew and detects a vault that has stopped producing snapshots. When the subgraph does not
 * report a block timestamp, `nowSeconds` (the caller's wall clock) is used as a fallback so a verdict is always
 * produced. Consumers can additionally detect subgraph indexing lag by comparing `subgraphBlockTimestamp`
 * against their own clock. Snapshots are expected newest-first.
 */
export function computeNavStaleness(params: {
  snapshots: NavSnapshot[]
  subgraphBlockNumber: number | null
  subgraphBlockTimestamp: number | null
  nowSeconds: number
  thresholdSeconds?: number
}): NavStaleness {
  const thresholdSeconds = params.thresholdSeconds ?? DEFAULT_STALENESS_THRESHOLD_SECONDS

  const latestTsRaw = params.snapshots.length > 0 ? Number(params.snapshots[0]?.timestamp) : NaN
  const latestSnapshotTimestamp = Number.isFinite(latestTsRaw) ? latestTsRaw : null

  const blockTimestamp =
    params.subgraphBlockTimestamp != null && Number.isFinite(params.subgraphBlockTimestamp)
      ? params.subgraphBlockTimestamp
      : null
  const blockNumber =
    params.subgraphBlockNumber != null && Number.isFinite(params.subgraphBlockNumber)
      ? params.subgraphBlockNumber
      : null

  const referenceTimestamp = blockTimestamp ?? params.nowSeconds
  const ageSeconds =
    latestSnapshotTimestamp != null ? referenceTimestamp - latestSnapshotTimestamp : null
  const isStale = ageSeconds === null || ageSeconds > thresholdSeconds

  return {
    isStale,
    latestSnapshotTimestamp,
    ageSeconds,
    thresholdSeconds,
    subgraphBlockNumber: blockNumber,
    subgraphBlockTimestamp: blockTimestamp,
  }
}

/**
 * 24-hour NAV (pricePerShare) change: (latest - previous) / previous over the two most recent daily
 * snapshots. Returns a decimal fraction (0.0003 = +0.03%), or null when there aren't two snapshots / a price
 * is non-finite / the previous price is <= 0. Mirrors apps/earn-protocol/helpers/get-nav-price-change-24h.ts.
 */
export function navPriceChange24h(snapshots: NavSnapshot[]): number | null {
  if (snapshots.length < 2) {
    return null
  }
  const latest = Number(snapshots[0]?.pricePerShare)
  const previous = Number(snapshots[1]?.pricePerShare)
  if (!Number.isFinite(latest) || !Number.isFinite(previous) || previous <= 0) {
    return null
  }
  return new BigNumber(latest).minus(previous).div(previous).toNumber()
}

/**
 * N-day NAV (pricePerShare) change, annualised: ((latest - past) / past) / daysUsed * 365. Picks the most
 * recent snapshot at least `targetDays` old; if none exists (young fleet) falls back to the oldest available
 * snapshot and annualises by the actual window spanned. Returns a decimal fraction (0.0487 = +4.87%), or null
 * when there aren't two snapshots / a price/timestamp is non-finite / a price is <= 0. Generalised from
 * apps/earn-protocol/helpers/get-nav-price-change-30d.ts.
 */
export function navChangeAnnualised(snapshots: NavSnapshot[], targetDays: number): number | null {
  if (snapshots.length < 2) {
    return null
  }
  const latestPrice = Number(snapshots[0]?.pricePerShare)
  const latestTs = Number(snapshots[0]?.timestamp)
  if (!Number.isFinite(latestPrice) || latestPrice <= 0 || !Number.isFinite(latestTs)) {
    return null
  }

  const targetTs = latestTs - targetDays * SECONDS_PER_DAY

  // snapshots are ordered newest -> oldest; default to the oldest available (young-fleet fallback), then walk
  // newest -> oldest to find the most recent snapshot at least `targetDays` old.
  let past = snapshots[snapshots.length - 1]
  for (let i = 1; i < snapshots.length; i++) {
    if (Number(snapshots[i]?.timestamp) <= targetTs) {
      past = snapshots[i]
      break
    }
  }

  const pastPrice = Number(past.pricePerShare)
  const pastTs = Number(past.timestamp)
  if (!Number.isFinite(pastPrice) || pastPrice <= 0 || !Number.isFinite(pastTs)) {
    return null
  }

  const change = new BigNumber(latestPrice).minus(pastPrice).div(pastPrice).toNumber()
  const daysUsed = Math.max(1, Math.round((latestTs - pastTs) / SECONDS_PER_DAY))
  return new BigNumber(change).div(daysUsed).times(DAYS_PER_YEAR).toNumber()
}
