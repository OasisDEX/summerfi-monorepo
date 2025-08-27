import { cleanRateSeries, type RatePoint, type CleanOpts } from './cleanRateSeries'

export interface HybridCleanOpts extends CleanOpts {
  /** Maximum reasonable APY % - anything beyond this is definitely an error */
  maxReasonableRate?: number
  /** Minimum reasonable APY % - anything below this is definitely an error */
  minReasonableRate?: number
  /** Factor for contextual outlier detection (e.g., 10 = 10x median is suspicious) */
  contextFactor?: number
}

/**
 * Hybrid approach to cleaning rate series that combines:
 * 1. Hard limits for impossible values
 * 2. Statistical outlier detection
 * 3. Contextual reasonableness checks
 */
export function cleanRateSeriesHybrid(
  points: RatePoint[],
  opts: HybridCleanOpts = {},
): { cleanedPct: number[]; replaced: boolean[] } {
  const {
    maxReasonableRate = 500, // Max 500% APY seems generous but possible
    minReasonableRate = -95, // Min -95% (near total loss but not impossible)
    contextFactor = 10, // Values >10x surrounding median are suspicious
    win = 24,
    nSigmas = 3.0, // Slightly more sensitive than default
    maxRunToFix = 6, // Handle up to 6 hour error bursts
    ...restOpts
  } = opts

  if (!points.length) return { cleanedPct: [], replaced: [] }
  if (points.length < 3) {
    return {
      cleanedPct: points.map((p) => p.r),
      replaced: new Array(points.length).fill(false),
    }
  }

  // Step 1: Pre-filter absolute impossibilities
  const preFiltered = points.map((p) => ({
    ...p,
    r: p.r > maxReasonableRate || p.r < minReasonableRate ? NaN : p.r,
  }))

  // Step 2: Apply statistical cleaning on the pre-filtered data
  const statisticalResult = cleanRateSeries(
    preFiltered.map((p) => ({
      ...p,
      r: isNaN(p.r) ? 0 : p.r, // Temporarily use 0 for NaN to avoid breaking the algorithm
    })),
    {
      win,
      nSigmas,
      maxRunToFix,
      ...restOpts,
    },
  )

  // Step 3: Apply contextual reasonableness check
  const finalReplaced = new Array(points.length).fill(false)
  const finalCleaned = new Array(points.length).fill(0)

  for (let i = 0; i < points.length; i++) {
    const originalRate = points[i].r

    // Mark as needing replacement if:
    // 1. It was pre-filtered as impossible
    const isImpossible = originalRate > maxReasonableRate || originalRate < minReasonableRate

    // 2. It was statistically identified as outlier
    const isStatisticalOutlier = statisticalResult.replaced[i]

    // 3. Contextual check: is it wildly different from surroundings?
    let isContextualOutlier = false
    if (!isImpossible && !isStatisticalOutlier && Math.abs(originalRate) > 50) {
      // Only check rates > 50% for contextual outliers
      const windowStart = Math.max(0, i - 12)
      const windowEnd = Math.min(points.length, i + 13)
      const surroundingRates = []

      for (let j = windowStart; j < windowEnd; j++) {
        if (j !== i && Math.abs(points[j].r) <= maxReasonableRate) {
          surroundingRates.push(points[j].r)
        }
      }

      if (surroundingRates.length >= 6) {
        const median = getMedian(surroundingRates)
        if (median !== 0 && Math.abs(originalRate / median) > contextFactor) {
          isContextualOutlier = true
        }
      }
    }

    finalReplaced[i] = isImpossible || isStatisticalOutlier || isContextualOutlier

    // Use the statistically cleaned value if available, otherwise will interpolate
    if (finalReplaced[i]) {
      finalCleaned[i] = NaN // Mark for interpolation
    } else {
      finalCleaned[i] = originalRate
    }
  }

  // Step 4: Interpolate the NaN values
  const timestamps = points.map((p) => p.t)
  const interpolated = linearTimeInterpolation(timestamps, finalCleaned)

  return { cleanedPct: interpolated, replaced: finalReplaced }
}

function getMedian(values: number[]): number {
  const sorted = values.filter((v) => !isNaN(v)).sort((a, b) => a - b)
  if (!sorted.length) return 0
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function linearTimeInterpolation(timestamps: number[], values: number[]): number[] {
  const result = [...values]
  let i = 0

  while (i < result.length) {
    if (!isNaN(result[i])) {
      i++
      continue
    }

    // Find the span of NaN values
    const startIdx = i - 1
    while (i < result.length && isNaN(result[i])) i++
    const endIdx = i

    // Get boundary values for interpolation
    const startVal = startIdx >= 0 ? result[startIdx] : NaN
    const endVal = endIdx < result.length ? result[endIdx] : NaN

    // Interpolate
    for (let j = startIdx + 1; j < endIdx; j++) {
      if (!isNaN(startVal) && !isNaN(endVal)) {
        // Linear interpolation based on time
        const weight =
          (timestamps[j] - timestamps[startIdx]) / (timestamps[endIdx] - timestamps[startIdx])
        result[j] = startVal + (endVal - startVal) * weight
      } else if (!isNaN(startVal)) {
        result[j] = startVal // Forward fill
      } else if (!isNaN(endVal)) {
        result[j] = endVal // Backward fill
      } else {
        result[j] = 0 // No good values, use 0
      }
    }
  }

  return result
}
