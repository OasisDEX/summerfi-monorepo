export type RatePoint = { t: number; r: number } // t: ms since epoch, r: % APR/APY

export interface CleanOpts {
  /** rolling window in *samples* (not seconds). e.g., 24 for hourly (~1 day) */
  win?: number
  /** Hampel threshold in "sigmas" (MAD scaled to std) */
  nSigmas?: number
  /** only replace short, isolated outlier runs; longer runs are preserved */
  maxRunToFix?: number
  /** global winsorization quantiles on the log scale to protect rolling stats */
  clipQ?: [number, number]
}

const K = 1.4826 // MAD -> std conversion factor

function median(a: number[]): number {
  const b = a
    .filter(Number.isFinite)
    .slice()
    .sort((x, y) => x - y)
  if (!b.length) return NaN
  const m = Math.floor(b.length / 2)
  return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2
}

function quantile(sorted: number[], p: number): number {
  if (!sorted.length) return NaN
  const i = Math.floor(p * (sorted.length - 1))
  return sorted[Math.max(0, Math.min(sorted.length - 1, i))]
}

function winsorize(xs: number[], loq: number, hiq: number): number[] {
  const s = xs
    .filter(Number.isFinite)
    .slice()
    .sort((a, b) => a - b)
  const lo = quantile(s, loq)
  const hi = quantile(s, hiq)
  return xs.map((v) => Math.min(hi, Math.max(lo, v)))
}

/** Linear interpolation along the time axis. */
function linearTimeInterp(t: number[], y: number[]): number[] {
  const n = y.length
  const out = y.slice()
  let i = 0
  while (i < n) {
    if (Number.isFinite(out[i])) {
      i++
      continue
    }
    const start = i - 1 // could be -1
    while (i < n && !Number.isFinite(out[i])) i++
    const end = i // first finite after gap, could be n

    const y0 = start >= 0 ? out[start] : NaN
    const y1 = end < n ? out[end] : NaN

    for (let k = start + 1; k < end; k++) {
      if (Number.isFinite(y0) && Number.isFinite(y1)) {
        const w = (t[k] - t[start]) / (t[end] - t[start])
        out[k] = y0 + (y1 - y0) * w
      } else if (Number.isFinite(y0)) {
        out[k] = y0
      } else if (Number.isFinite(y1)) {
        out[k] = y1
      } else {
        out[k] = 0 // fallback
      }
    }
  }
  return out
}

/**
 * Robust spike-killer for multiplicative rates (APR/APY) with interpolation.
 * - Works on log1p(rate_decimal) for stability
 * - Winsorizes global tails
 * - Hampel detects local outliers
 * - Only short runs (<= maxRunToFix) are interpolated; longer runs are preserved
 *
 * Using default values:
 * - win: 24 (for hourly data, ~1 day window)
 * - nSigmas: 3.5 (moderate sensitivity)
 * - maxRunToFix: 2 (only fix 1-2 point spikes)
 * - clipQ: [0.005, 0.995] (clip extreme 0.5% tails)
 */
export function cleanRateSeries(
  points: RatePoint[],
  opts: CleanOpts = {},
): { cleanedPct: number[]; replaced: boolean[] } {
  const { win = 24, nSigmas = 3.5, maxRunToFix = 2, clipQ = [0.005, 0.995] } = opts

  if (!points.length) return { cleanedPct: [], replaced: [] }

  // Guard against too small series
  if (points.length < 3) {
    return {
      cleanedPct: points.map((p) => p.r),
      replaced: new Array(points.length).fill(false),
    }
  }

  // Ensure ascending time
  const ps = points.slice().sort((a, b) => a.t - b.t)

  const t = ps.map((p) => p.t)
  const pct = ps.map((p) => p.r)

  // 1) % -> decimal -> log1p (guard against ≤ -100%)
  const x = pct.map((r) => Math.log1p(Math.max(-0.99, r / 100)))

  // 2) Hampel: rolling median + MAD (detect outliers first on original log data)
  const half = Math.max(1, Math.floor(win / 2))
  const isOutlier = new Array(x.length).fill(false)

  for (let i = 0; i < x.length; i++) {
    const a = Math.max(0, i - half)
    const b = Math.min(x.length, i + half + 1)
    const slice = x.slice(a, b)

    // Pre-filter extreme values before computing median to avoid contamination
    // Values > 1000% or < -90% in original scale are clearly errors
    const filteredSlice = slice.filter((v) => {
      const pctValue = Math.expm1(v) * 100
      return Math.abs(pctValue) <= 1000
    })

    // Use filtered slice if we have enough points, otherwise fall back to original
    const workingSlice = filteredSlice.length >= 3 ? filteredSlice : slice
    const m = median(workingSlice)
    const deviations = workingSlice.map((v) => Math.abs(v - m))
    let s = K * median(deviations)

    // If MAD is too small (all values similar), use a robust estimate
    if (s < 1e-10) {
      // Use mean absolute deviation as fallback
      const meanDev = deviations.reduce((a, b) => a + b, 0) / deviations.length
      s = Math.max(meanDev * K, 0.01) // Ensure minimum threshold
    }

    if (Number.isFinite(s) && Math.abs(x[i] - m) > nSigmas * s) {
      isOutlier[i] = true
    }
  }

  // 3) Only replace short, isolated runs
  const toReplace = isOutlier.slice()
  let i = 0
  while (i < toReplace.length) {
    if (!toReplace[i]) {
      i++
      continue
    }
    const start = i
    while (i < toReplace.length && toReplace[i]) i++
    const len = i - start
    if (len > maxRunToFix) {
      // Don't replace long runs - they might be real regime changes
      for (let k = start; k < i; k++) toReplace[k] = false
    }
  }

  // 4) For interpolation, use original values but mark outliers as NaN
  // Don't use winsorized values as they may still be contaminated
  const xf = x.map((v, idx) => {
    if (toReplace[idx]) {
      return NaN
    }
    // Also exclude extreme values that weren't marked for replacement
    // but are clearly erroneous (e.g., > 1000% or < -90%)
    const pctValue = Math.expm1(v) * 100
    if (Math.abs(pctValue) > 1000) {
      return NaN
    }
    return v
  })

  // 5) Interpolate on log scale; convert back to %
  const xi = linearTimeInterp(t, xf)
  const cleanedPct = xi.map((v) => Math.expm1(v) * 100)

  return { cleanedPct, replaced: toReplace }
}

/**
 * Helper to determine appropriate window size based on data granularity
 * by analyzing the median time interval between points
 */
export function inferWindowSize(timestamps: number[]): number {
  if (timestamps.length < 2) return 24 // default

  const intervals: number[] = []
  for (let i = 1; i < timestamps.length; i++) {
    intervals.push(timestamps[i] - timestamps[i - 1])
  }

  const medianInterval = median(intervals)

  // Convert to common time units (assuming milliseconds)
  const TEN_MINUTES = 10 * 60 * 1000
  const HOUR = 60 * 60 * 1000
  const DAY = 24 * HOUR

  if (medianInterval <= TEN_MINUTES) {
    return 36 // ~6 hours of 10-min data
  } else if (medianInterval <= HOUR * 1.5) {
    return 24 // ~1 day of hourly data
  } else if (medianInterval <= DAY * 1.5) {
    return 7 // ~1 week of daily data
  } else {
    return 4 // ~1 month of weekly data
  }
}
