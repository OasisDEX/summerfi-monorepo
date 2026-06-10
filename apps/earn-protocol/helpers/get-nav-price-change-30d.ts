import { type GetVaultQueryRwa } from '@summerfi/subgraph-manager-common'
import BigNumber from 'bignumber.js'

const TARGET_DAYS = 30
const SECONDS_PER_DAY = 86_400
const DAYS_PER_YEAR = 365

export type NavPriceChange30d = {
  /** (latest - past) / past as a decimal fraction (e.g. 0.0042 = +0.42%) */
  change: number
  /** annualized return: `change / daysUsed * 365`, as a decimal fraction (e.g. 0.0487 = +4.87% APY) */
  apy: number
  /** number of days actually spanned by the data used (oldest used snapshot .. latest) */
  daysUsed: number
  /** true when fewer than TARGET_DAYS of history exist, so the change covers a shorter window */
  isPartial: boolean
}

/**
 * Computes an RWA vault's NAV (pricePerShare) change over the last ~30 days from its daily snapshots,
 * and annualizes it into an APY. The `GetVault` query requests up to 31 daily snapshots (newest
 * first), so `[0]` is the latest day.
 *
 * Picks the most recent snapshot that is at least 30 days older than the latest. If none exists (the
 * vault is younger than 30 days) it falls back to the oldest available snapshot and flags `isPartial`,
 * reporting how many days of history were actually used so the UI can explain the partial value.
 *
 * The APY annualizes by the actual window: `((latest - past) / past) / daysUsed * 365`, so a partial
 * window still annualizes correctly (just from noisier, shorter data).
 *
 * Returns `null` (rendered as "n/a") when there aren't two snapshots, a price/timestamp is
 * missing or non-finite, or the past price is zero (avoids division by zero).
 */
export const getNavPriceChange30d = (
  vault: GetVaultQueryRwa['vault'],
): NavPriceChange30d | null => {
  const snapshots = vault?.dailySnapshots

  if (!snapshots || snapshots.length < 2) {
    return null
  }

  const latestPrice = Number(snapshots[0]?.pricePerShare)
  const latestTs = Number(snapshots[0]?.timestamp)

  if (!Number.isFinite(latestPrice) || latestPrice <= 0 || !Number.isFinite(latestTs)) {
    return null
  }

  const targetTs = latestTs - Number(TARGET_DAYS * SECONDS_PER_DAY)

  // snapshots are ordered newest -> oldest; default to the oldest available (young-vault fallback),
  // then walk from newest to oldest to find the most recent snapshot at least 30 days old.
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
