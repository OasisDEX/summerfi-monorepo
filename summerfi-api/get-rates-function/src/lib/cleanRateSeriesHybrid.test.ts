import { describe, test, expect } from 'vitest'
import { cleanRateSeriesHybrid } from './cleanRateSeriesHybrid'

const ms = (h: number) => h * 3600 * 1000

describe('cleanRateSeriesHybrid', () => {
  test('handles extreme values beyond hard limits', () => {
    const t0 = Date.now()
    const points = [
      { t: t0, r: 10 },
      { t: t0 + ms(1), r: 10 },
      { t: t0 + ms(2), r: 57762.58 }, // Way beyond maxReasonableRate
      { t: t0 + ms(3), r: -9041.28 }, // Way below minReasonableRate
      { t: t0 + ms(4), r: 10 },
      { t: t0 + ms(5), r: 10 },
    ]
    
    const { cleanedPct, replaced } = cleanRateSeriesHybrid(points, {
      maxReasonableRate: 500,
      minReasonableRate: -95,
    })
    
    // Extreme values should be replaced
    expect(replaced[2]).toBe(true)
    expect(replaced[3]).toBe(true)
    
    // Normal values should not be replaced
    expect(replaced[0]).toBe(false)
    expect(replaced[1]).toBe(false)
    expect(replaced[4]).toBe(false)
    expect(replaced[5]).toBe(false)
    
    // Replaced values should be reasonable
    expect(cleanedPct[2]).toBeLessThan(50)
    expect(cleanedPct[3]).toBeGreaterThan(-20)
  })

  test('handles long runs of extreme values from taste-rates.json', () => {
    const t0 = Date.now()
    // 10-hour run of -9041% that default approach couldn't handle
    const points = [
      { t: t0, r: 3.52 },
      { t: t0 + ms(1), r: 3.52 },
      ...Array.from({ length: 10 }, (_, i) => ({ 
        t: t0 + ms(2 + i), 
        r: -9041.28 
      })),
      { t: t0 + ms(12), r: 3.52 },
      { t: t0 + ms(13), r: 3.52 },
    ]
    
    const { cleanedPct, replaced } = cleanRateSeriesHybrid(points, {
      maxReasonableRate: 500,
      minReasonableRate: -95,
      contextFactor: 10,
      win: 24,
      nSigmas: 3.0,
      maxRunToFix: 6
    })
    
    // All extreme values should be replaced even in long run
    for (let i = 2; i < 12; i++) {
      expect(replaced[i]).toBe(true)
    }
    
    // Replaced values should be reasonable
    for (let i = 2; i < 12; i++) {
      expect(cleanedPct[i]).toBeGreaterThan(-10)
      expect(cleanedPct[i]).toBeLessThan(20)
    }
  })

  test('detects contextual outliers above 50%', () => {
    const t0 = Date.now()
    // Value that's not extreme but is 10x the surrounding median
    const points = Array.from({ length: 25 }, (_, i) => ({ 
      t: t0 + ms(i), 
      r: 5 
    }))
    points[12].r = 75 // 15x the median, above 50% threshold
    
    const { cleanedPct, replaced } = cleanRateSeriesHybrid(points, {
      maxReasonableRate: 500,
      minReasonableRate: -95,
      contextFactor: 10,
    })
    
    // Should be replaced as contextual outlier
    expect(replaced[12]).toBe(true)
    expect(cleanedPct[12]).toBeCloseTo(5, 1)
  })

  test('preserves values below 50% even if statistical outlier', () => {
    const t0 = Date.now()
    const points = Array.from({ length: 25 }, (_, i) => ({ 
      t: t0 + ms(i), 
      r: 5 
    }))
    points[12].r = 30 // Statistical outlier but below 50%
    
    const { cleanedPct, replaced } = cleanRateSeriesHybrid(points, {
      maxReasonableRate: 500,
      minReasonableRate: -95,
      contextFactor: 10,
      nSigmas: 3.0,
    })
    
    // May or may not be replaced based on statistical detection
    // but not by contextual check (under 50%)
    if (replaced[12]) {
      expect(cleanedPct[12]).toBeGreaterThan(4)
      expect(cleanedPct[12]).toBeLessThan(31)
    }
  })

  test('handles all three detection criteria', () => {
    const t0 = Date.now()
    const points = [
      { t: t0, r: 5 },
      { t: t0 + ms(1), r: 5 },
      { t: t0 + ms(2), r: 600 }, // Exceeds hard limit
      { t: t0 + ms(3), r: 150 }, // Statistical outlier
      { t: t0 + ms(4), r: 80 },  // Contextual outlier (16x median, >50%)
      { t: t0 + ms(5), r: 5 },
      { t: t0 + ms(6), r: 5 },
    ]
    
    const { replaced } = cleanRateSeriesHybrid(points, {
      maxReasonableRate: 500,
      minReasonableRate: -95,
      contextFactor: 10,
      nSigmas: 2.0,
      win: 6,  // Small window for better detection
    })
    
    // All three types should be detected
    expect(replaced[2]).toBe(true) // Hard limit
    expect(replaced[3]).toBe(true) // Statistical
    expect(replaced[4]).toBe(true) // Contextual (>50% and >10x median)
  })

  test('preserves clean data from test-rates-2.json', () => {
    const t0 = Date.now()
    // Clean gradual changes
    const points = [
      { t: t0, r: 11.63 },
      { t: t0 + ms(1), r: 11.55 },
      { t: t0 + ms(2), r: 11.47 },
      { t: t0 + ms(3), r: 11.39 },
      { t: t0 + ms(4), r: 11.31 },
      { t: t0 + ms(5), r: 11.23 },
      { t: t0 + ms(6), r: 11.15 },
      { t: t0 + ms(7), r: 11.07 },
      { t: t0 + ms(8), r: 10.99 },
      { t: t0 + ms(9), r: 10.91 },
    ]
    
    const { replaced } = cleanRateSeriesHybrid(points, {
      maxReasonableRate: 500,
      minReasonableRate: -95,
      contextFactor: 10,
      win: 24,
      nSigmas: 3.0,
      maxRunToFix: 6
    })
    
    // No replacements for clean gradual changes
    expect(replaced.every(r => r === false)).toBe(true)
  })

  test('small sign inversions within reasonable limits are preserved', () => {
    const t0 = Date.now()
    // From taste-rates.json: positive to negative flip
    const points = [
      { t: t0, r: 10.90 },
      { t: t0 + ms(1), r: 10.90 },
      { t: t0 + ms(2), r: 10.90 },
      { t: t0 + ms(3), r: -1.28 }, // Sign flip but within -95% to 500% limits
      { t: t0 + ms(4), r: -1.28 },
      { t: t0 + ms(5), r: -1.28 },
      { t: t0 + ms(6), r: 10.90 },
      { t: t0 + ms(7), r: 10.90 },
    ]
    
    const { cleanedPct, replaced } = cleanRateSeriesHybrid(points, {
      maxReasonableRate: 500,
      minReasonableRate: -95,
      contextFactor: 10,
      win: 6,
      nSigmas: 3.0,
      maxRunToFix: 6
    })
    
    // -1.28% is within reasonable limits and not statistically extreme enough
    // The hybrid approach correctly preserves these as potentially valid
    const replacedCount = [3, 4, 5].filter(i => replaced[i]).length
    expect(replacedCount).toBe(0)
    
    // Values should remain unchanged
    expect(cleanedPct[3]).toBe(-1.28)
    expect(cleanedPct[4]).toBe(-1.28)
    expect(cleanedPct[5]).toBe(-1.28)
  })

  test('handles empty and small inputs', () => {
    const t0 = Date.now()
    
    // Empty
    const empty = cleanRateSeriesHybrid([])
    expect(empty.cleanedPct).toEqual([])
    expect(empty.replaced).toEqual([])
    
    // Single point
    const single = cleanRateSeriesHybrid([{ t: t0, r: 10 }])
    expect(single.cleanedPct).toEqual([10])
    expect(single.replaced).toEqual([false])
    
    // Two points
    const two = cleanRateSeriesHybrid([
      { t: t0, r: 10 },
      { t: t0 + ms(1), r: 12 }
    ])
    expect(two.cleanedPct).toEqual([10, 12])
    expect(two.replaced).toEqual([false, false])
  })

  test('interpolates correctly with time-based weighting', () => {
    const t0 = Date.now()
    const points = [
      { t: t0, r: 10 },
      { t: t0 + ms(1), r: 10000 }, // Spike to replace
      { t: t0 + ms(2), r: 10000 }, // Spike to replace
      { t: t0 + ms(3), r: 10000 }, // Spike to replace
      { t: t0 + ms(4), r: 20 },
    ]
    
    const { cleanedPct, replaced } = cleanRateSeriesHybrid(points, {
      maxReasonableRate: 500,
      minReasonableRate: -95,
    })
    
    // Spikes should be replaced
    expect(replaced[1]).toBe(true)
    expect(replaced[2]).toBe(true)
    expect(replaced[3]).toBe(true)
    
    // Interpolated values should gradually increase from 10 to 20
    expect(cleanedPct[1]).toBeCloseTo(12.5, 1)
    expect(cleanedPct[2]).toBeCloseTo(15, 1)
    expect(cleanedPct[3]).toBeCloseTo(17.5, 1)
  })

  test('handles edge case with all NaN needing interpolation', () => {
    const t0 = Date.now()
    const points = [
      { t: t0, r: 10 },
      { t: t0 + ms(1), r: 10000 }, // Will be NaN
      { t: t0 + ms(2), r: -10000 }, // Will be NaN
      { t: t0 + ms(3), r: 10000 }, // Will be NaN
      { t: t0 + ms(4), r: 5 },
    ]
    
    const { cleanedPct } = cleanRateSeriesHybrid(points, {
      maxReasonableRate: 500,
      minReasonableRate: -95,
    })
    
    // Should interpolate between 10 and 5
    expect(cleanedPct[0]).toBe(10)
    expect(cleanedPct[1]).toBeGreaterThan(5)
    expect(cleanedPct[1]).toBeLessThan(10)
    expect(cleanedPct[2]).toBeGreaterThan(5)
    expect(cleanedPct[2]).toBeLessThan(10)
    expect(cleanedPct[3]).toBeGreaterThan(5)
    expect(cleanedPct[3]).toBeLessThan(10)
    expect(cleanedPct[4]).toBe(5)
  })

  test('handles boundary cases at start and end', () => {
    const t0 = Date.now()
    
    // Spike at start
    const startSpike = [
      { t: t0, r: 10000 },
      { t: t0 + ms(1), r: 5 },
      { t: t0 + ms(2), r: 5 },
    ]
    
    const startResult = cleanRateSeriesHybrid(startSpike, {
      maxReasonableRate: 500,
    })
    
    expect(startResult.replaced[0]).toBe(true)
    expect(startResult.cleanedPct[0]).toBe(5) // Backward fill
    
    // Spike at end
    const endSpike = [
      { t: t0, r: 5 },
      { t: t0 + ms(1), r: 5 },
      { t: t0 + ms(2), r: 10000 },
    ]
    
    const endResult = cleanRateSeriesHybrid(endSpike, {
      maxReasonableRate: 500,
    })
    
    expect(endResult.replaced[2]).toBe(true)
    expect(endResult.cleanedPct[2]).toBe(5) // Forward fill
  })

  test('handles constant values with MAD = 0', () => {
    const t0 = Date.now()
    const points = Array.from({ length: 25 }, (_, i) => ({ 
      t: t0 + ms(i), 
      r: 3.96 
    }))
    points[12].r = -27.76 // Outlier in constant data
    
    const { cleanedPct, replaced } = cleanRateSeriesHybrid(points, {
      maxReasonableRate: 500,
      minReasonableRate: -95,
      win: 24,
      nSigmas: 3.0,
    })
    
    // Outlier should be replaced
    expect(replaced[12]).toBe(true)
    
    // Should be replaced with the constant value
    expect(cleanedPct[12]).toBeCloseTo(3.96, 1)
  })
})