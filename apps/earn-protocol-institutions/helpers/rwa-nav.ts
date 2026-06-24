import BigNumber from 'bignumber.js'

// Ported from earn-protocol (get-nav-price-change-24h / -30d). Typed structurally against the RWA
// `GetVault` result (it returns `dailySnapshots(first: 31, orderBy: timestamp desc)` +
// `createdTimestamp`) so we don't need to pull in the subgraph-manager types here.
type NavSnapshot = {
  pricePerShare?: string | number | bigint | null
  timestamp?: string | number | bigint | null
}
type NavVault =
  | {
      dailySnapshots?: NavSnapshot[] | null
      createdTimestamp?: string | number | bigint | null
    }
  | null
  | undefined

const SECONDS_PER_DAY = 86_400
const TARGET_DAYS = 30
const DAYS_PER_YEAR = 365

/**
 * Day-over-day change of an RWA vault's NAV (pricePerShare) from its daily snapshots ([0] = latest,
 * [1] = previous). Returns a decimal fraction (0.0034 = +0.34%), or null when it can't be computed.
 */
export const getNavPriceChange24h = (vault: NavVault): number | null => {
  const snapshots = vault?.dailySnapshots

  if (!snapshots || snapshots.length < 2) {
    return null
  }

  const latest = Number(snapshots[0]?.pricePerShare)
  const previous = Number(snapshots[1]?.pricePerShare)

  if (!Number.isFinite(latest) || !Number.isFinite(previous) || previous <= 0) {
    return null
  }

  return new BigNumber(latest).minus(previous).div(previous).toNumber()
}

export type NavPriceChange30d = {
  change: number
  apy: number
  daysUsed: number
  isPartial: boolean
}

/**
 * RWA vault's NAV change over ~30 days, annualized into an APY. Picks the most recent snapshot at
 * least 30 days older than the latest; falls back to the oldest available (flagged `isPartial`) for
 * young vaults. `skipFirstNDays` (config `navPriceSkipFirstNDays`) drops the volatile inception
 * window by `createdTimestamp`, but only while ≥2 snapshots remain. Returns null when uncomputable.
 */
export const getNavPriceChange30d = (
  vault: NavVault,
  skipFirstNDays = 0,
): NavPriceChange30d | null => {
  let snapshots = vault?.dailySnapshots

  if (!snapshots || snapshots.length < 2) {
    return null
  }

  if (skipFirstNDays > 0) {
    const createdTs = Number(vault?.createdTimestamp)

    if (Number.isFinite(createdTs)) {
      const cutoffTs = createdTs + Number(skipFirstNDays * SECONDS_PER_DAY)
      const trimmed = snapshots.filter((snapshot) => Number(snapshot.timestamp) >= cutoffTs)

      if (trimmed.length >= 2) {
        snapshots = trimmed
      }
    }
  }

  const latestPrice = Number(snapshots[0]?.pricePerShare)
  const latestTs = Number(snapshots[0]?.timestamp)

  if (!Number.isFinite(latestPrice) || latestPrice <= 0 || !Number.isFinite(latestTs)) {
    return null
  }

  const targetTs = latestTs - Number(TARGET_DAYS * SECONDS_PER_DAY)

  // snapshots are newest -> oldest; default to the oldest (young-vault fallback), then walk to find
  // the most recent snapshot that is at least 30 days old.
  let past = snapshots[snapshots.length - 1]
  let isPartial = true

  for (let i = 1; i < snapshots.length; i++) {
    if (Number(snapshots[i]?.timestamp) <= targetTs) {
      past = snapshots[i]
      isPartial = false

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
  const apy = new BigNumber(change).div(daysUsed).times(DAYS_PER_YEAR).toNumber()

  return { change, apy, daysUsed, isPartial }
}
