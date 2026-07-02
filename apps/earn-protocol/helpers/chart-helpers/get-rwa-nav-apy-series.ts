import { type ChartDataPoints } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'

const SECONDS_PER_DAY = 86_400
const DAYS_PER_YEAR = 365

// Derives an "annualised APY" series from a NAV (pricePerShare) chart series, computed locally for the
// currently selected timeframe. Each point's APY is the annualised return from the first NAV point in
// the window to that point: `((nav / baseNav) - 1) / elapsedDays * 365`, as a decimal fraction
// (matching the navApy30d stat / getNavPriceChange30d). Because the reference is the window's first
// snapshot, switching timeframe re-bases the line — i.e. APY is annualised over the selected range.
//
// Mirrors the NAV series' gap handling: buckets without a NAV (or the base point itself, at 0 days
// elapsed) carry no `apy` key, so the chart bridges them via connectNulls instead of dropping to 0.
export const getRwaNavApySeries = (navSeries: ChartDataPoints[]): ChartDataPoints[] => {
  let baseNav: number | undefined
  let baseTs: number | undefined

  return navSeries.map((point) => {
    const nav = typeof point.navPrice === 'number' ? point.navPrice : null

    // Empty bucket (no snapshot) — leave it a gap.
    if (nav == null || nav <= 0) {
      return point
    }

    // First NAV in the window: the annualisation reference. No APY at day 0.
    if (baseNav == null || baseTs == null) {
      baseNav = nav
      baseTs = point.timestamp

      return point
    }

    const elapsedDays = (point.timestamp - baseTs) / SECONDS_PER_DAY

    if (elapsedDays <= 0) {
      return point
    }

    const apy = new BigNumber(nav)
      .minus(baseNav)
      .div(baseNav)
      .div(elapsedDays)
      .times(DAYS_PER_YEAR)
      .toNumber()

    return { ...point, apy }
  })
}
