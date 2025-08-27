import { describe, test, expect } from 'vitest'
import { cleanRateSeries, inferWindowSize } from './cleanRateSeries'

const ms = (h: number) => h * 3600 * 1000

describe('cleanRateSeries', () => {
  test('replaces a single huge spike with interpolation', () => {
    const t0 = Date.now()
    const points = Array.from({ length: 25 }, (_, i) => ({ t: t0 + ms(i), r: 10 })) // 10% base rate
    points[12].r = 57762.58 // absurd spike like the one we saw

    const { cleanedPct, replaced } = cleanRateSeries(points, { win: 24, nSigmas: 3.5, maxRunToFix: 2 })
    
    // The spike should be replaced
    expect(replaced[12]).toBe(true)
    
    // The cleaned value should be reasonable (close to surrounding 10%)
    expect(cleanedPct[12]).toBeGreaterThan(5)
    expect(cleanedPct[12]).toBeLessThan(20)
    
    // Other points should not be replaced
    expect(replaced.filter(Boolean).length).toBe(1)
  })

  test('preserves sustained regime shift (long run not replaced)', () => {
    const t0 = Date.now()
    // 12 points at 8%, then 12 points at 20% (sustained change)
    const points = [
      ...Array.from({ length: 12 }, (_, i) => ({ t: t0 + ms(i), r: 8 })),
      ...Array.from({ length: 12 }, (_, i) => ({ t: t0 + ms(12 + i), r: 20 })),
    ]
    
    const { replaced } = cleanRateSeries(points, { win: 12, nSigmas: 3.5, maxRunToFix: 2 })
    
    // No points should be replaced as this is a sustained change
    expect(replaced.some(Boolean)).toBe(false)
  })

  test('handles negative or near -100% rates gracefully', () => {
    const t0 = Date.now()
    const points = [
      { t: t0, r: -10 },
      { t: t0 + ms(1), r: -5 },
      { t: t0 + ms(2), r: 15 },
    ]
    
    const { cleanedPct } = cleanRateSeries(points, { win: 3 })
    
    expect(cleanedPct.length).toBe(3)
    expect(cleanedPct.every(v => Number.isFinite(v))).toBe(true)
  })

  test('handles empty input', () => {
    const { cleanedPct, replaced } = cleanRateSeries([])
    
    expect(cleanedPct).toEqual([])
    expect(replaced).toEqual([])
  })

  test('handles very small series without crashing', () => {
    const t0 = Date.now()
    const points = [
      { t: t0, r: 10 },
      { t: t0 + ms(1), r: 12 },
    ]
    
    const { cleanedPct, replaced } = cleanRateSeries(points)
    
    expect(cleanedPct).toEqual([10, 12])
    expect(replaced).toEqual([false, false])
  })

  test('replaces two consecutive spikes but preserves longer runs', () => {
    const t0 = Date.now()
    const points = Array.from({ length: 30 }, (_, i) => ({ t: t0 + ms(i), r: 10 }))
    
    // Two consecutive spikes (should be replaced)
    points[10].r = 1000
    points[11].r = 1500
    
    // Four consecutive high values (should be preserved as potential regime change)
    points[20].r = 100
    points[21].r = 100
    points[22].r = 100
    points[23].r = 100
    
    const { cleanedPct, replaced } = cleanRateSeries(points, { win: 24, nSigmas: 3.5, maxRunToFix: 2 })
    
    // Two-point spike should be replaced
    expect(replaced[10]).toBe(true)
    expect(replaced[11]).toBe(true)
    expect(cleanedPct[10]).toBeLessThan(50)
    expect(cleanedPct[11]).toBeLessThan(50)
    
    // Four-point sustained change should be preserved
    expect(replaced[20]).toBe(false)
    expect(replaced[21]).toBe(false)
    expect(replaced[22]).toBe(false)
    expect(replaced[23]).toBe(false)
    expect(cleanedPct[20]).toBe(100)
  })

  test('handles real-world APY spike scenario', () => {
    const t0 = Date.now()
    // Simulate hourly data with realistic APYs
    const points = [
      { t: t0, r: 8.5 },
      { t: t0 + ms(1), r: 8.6 },
      { t: t0 + ms(2), r: 8.4 },
      { t: t0 + ms(3), r: 8.7 },
      { t: t0 + ms(4), r: 57762.58 }, // Massive spike
      { t: t0 + ms(5), r: 8.5 },
      { t: t0 + ms(6), r: 8.6 },
      { t: t0 + ms(7), r: 8.4 },
    ]
    
    const { cleanedPct, replaced } = cleanRateSeries(points, { win: 6, nSigmas: 3.5 })
    
    // Only the spike should be replaced
    expect(replaced[4]).toBe(true)
    expect(replaced.filter(Boolean).length).toBe(1)
    
    // Interpolated value should be close to surrounding values
    expect(cleanedPct[4]).toBeGreaterThan(7)
    expect(cleanedPct[4]).toBeLessThan(10)
  })

  test('cannot handle long runs of extreme spikes due to contamination', () => {
    const t0 = Date.now()
    // Pattern from 2025-08-02 with -9041% spikes for 10 consecutive hours
    const points = [
      { t: t0, r: 3.52 },
      { t: t0 + ms(1), r: 3.52 },
      { t: t0 + ms(2), r: 3.52 },
      // 10 consecutive hours of -9041.28%
      ...Array.from({ length: 10 }, (_, i) => ({ t: t0 + ms(3 + i), r: -9041.28 })),
      { t: t0 + ms(13), r: 3.52 },
      { t: t0 + ms(14), r: 3.52 },
      { t: t0 + ms(15), r: 3.52 },
    ]
    
    // Base algorithm cannot detect long runs of extremes
    // because they contaminate the window statistics
    const { cleanedPct, replaced } = cleanRateSeries(points, { 
      win: 6, 
      nSigmas: 1.5, 
      maxRunToFix: 12 
    })
    
    // This is a known limitation - long runs contaminate the MAD calculation
    const replacedCount = replaced.filter(Boolean).length
    
    // Cannot detect these with base algorithm
    expect(replacedCount).toBe(0)
    
    // This is why we need the hybrid approach!
    // The hybrid approach with hard limits handles this case correctly
  })

  test('handles extreme positive spike series from taste-rates.json', () => {
    const t0 = Date.now()
    // Pattern from 2025-08-02 with +57762% spikes
    const points = [
      { t: t0, r: 3.52 },
      { t: t0 + ms(1), r: 3.52 },
      // 10 consecutive hours of extreme positive spikes
      ...Array.from({ length: 10 }, (_, i) => ({ 
        t: t0 + ms(2 + i), 
        r: 57762.58 
      })),
      { t: t0 + ms(12), r: 3.52 },
      { t: t0 + ms(13), r: 3.52 },
    ]
    
    const { cleanedPct, replaced } = cleanRateSeries(points, { 
      win: 48, 
      nSigmas: 2.5, 
      maxRunToFix: 12 
    })
    
    // All extreme spikes should be replaced
    for (let i = 2; i < 12; i++) {
      expect(replaced[i]).toBe(true)
    }
    
    // Interpolated values should be reasonable
    for (let i = 2; i < 12; i++) {
      expect(cleanedPct[i]).toBeLessThan(50)
      expect(cleanedPct[i]).toBeGreaterThan(0)
    }
  })

  test('handles moderate step changes that persist (from taste-rates.json)', () => {
    const t0 = Date.now()
    // Pattern from 2025-08-03: sudden jump from 3.52% to 11.90% for 4 hours
    const points = [
      { t: t0, r: 3.52 },
      { t: t0 + ms(1), r: 3.52 },
      { t: t0 + ms(2), r: 3.52 },
      { t: t0 + ms(3), r: 11.90 }, // Sudden jump
      { t: t0 + ms(4), r: 11.90 },
      { t: t0 + ms(5), r: 11.90 },
      { t: t0 + ms(6), r: 11.90 },
      { t: t0 + ms(7), r: 3.52 }, // Back to normal
      { t: t0 + ms(8), r: 3.52 },
    ]
    
    const { cleanedPct, replaced } = cleanRateSeries(points, { 
      win: 24, 
      nSigmas: 3.0,
      maxRunToFix: 6
    })
    
    // With aggressive settings, these moderate jumps might be replaced
    // depending on the statistical threshold
    const replacedCount = replaced.filter(Boolean).length
    
    // If replaced, values should be smoothed
    if (replacedCount > 0) {
      for (let i = 3; i <= 6; i++) {
        if (replaced[i]) {
          expect(cleanedPct[i]).toBeGreaterThan(3)
          expect(cleanedPct[i]).toBeLessThan(12)
        }
      }
    }
  })

  test('small negative rate inversions are not detected by default', () => {
    const t0 = Date.now()
    // Pattern from 2025-08-14: positive 10.90% suddenly becomes -1.28%
    const points = [
      { t: t0, r: 10.90 },
      { t: t0 + ms(1), r: 10.90 },
      { t: t0 + ms(2), r: 10.90 },
      { t: t0 + ms(3), r: -1.28 }, // Sign inversion
      { t: t0 + ms(4), r: -1.28 },
      { t: t0 + ms(5), r: -1.28 },
      { t: t0 + ms(6), r: -1.28 },
      { t: t0 + ms(7), r: -1.28 },
      { t: t0 + ms(8), r: 10.90 }, // Back to positive
      { t: t0 + ms(9), r: 10.90 },
    ]
    
    const { cleanedPct, replaced } = cleanRateSeries(points, { 
      win: 6,
      nSigmas: 3.5,  // Default sensitivity
      maxRunToFix: 6
    })
    
    // Small inversions (-1.28%) are not extreme enough for detection
    // This is a known limitation of the base algorithm
    const replacedInversions = [3, 4, 5, 6, 7].filter(i => replaced[i]).length
    
    // These small inversions won't be detected with default settings
    expect(replacedInversions).toBe(0)
    
    // Values remain unchanged
    expect(cleanedPct[3]).toBe(-1.28)
    expect(cleanedPct[4]).toBe(-1.28)
  })

  test('preserves clean gradual changes (from test-rates-2.json)', () => {
    const t0 = Date.now()
    // Clean data with gradual changes
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
    
    const { replaced } = cleanRateSeries(points, { 
      win: 24, 
      nSigmas: 3.0,
      maxRunToFix: 6
    })
    
    // No values should be replaced as this is clean gradual change
    expect(replaced.every(r => r === false)).toBe(true)
  })

  test('handles mixed extreme spikes pattern (from taste-rates.json)', () => {
    const t0 = Date.now()
    // Pattern from 2025-08-13 with +1787% spike in an 11-hour run
    const points = [
      { t: t0, r: 3.97 },
      { t: t0 + ms(1), r: 3.97 },
      { t: t0 + ms(2), r: 1787.53 }, // Extreme spike
      { t: t0 + ms(3), r: 1787.53 },
      { t: t0 + ms(4), r: 1787.53 },
      { t: t0 + ms(5), r: 3.97 },
      { t: t0 + ms(6), r: 3.97 },
    ]
    
    const { cleanedPct, replaced } = cleanRateSeries(points, { 
      win: 24, 
      nSigmas: 3.0,
      maxRunToFix: 6
    })
    
    // Extreme spikes should be replaced
    expect(replaced[2]).toBe(true)
    expect(replaced[3]).toBe(true)
    expect(replaced[4]).toBe(true)
    
    // Replaced values should be close to surrounding normal values
    expect(cleanedPct[2]).toBeLessThan(50)
    expect(cleanedPct[3]).toBeLessThan(50)
    expect(cleanedPct[4]).toBeLessThan(50)
  })

  test('handles constant rate with single outlier (from taste-rates.json)', () => {
    const t0 = Date.now()
    // Pattern where all values are identical except one outlier
    const points = Array.from({ length: 25 }, (_, i) => ({ 
      t: t0 + ms(i), 
      r: 3.96 
    }))
    // Insert outlier
    points[12].r = -27.76
    
    const { cleanedPct, replaced } = cleanRateSeries(points, { 
      win: 24, 
      nSigmas: 3.0,
      maxRunToFix: 2
    })
    
    // The outlier should be replaced
    expect(replaced[12]).toBe(true)
    
    // Replaced value should match the constant rate
    expect(cleanedPct[12]).toBeCloseTo(3.96, 1)
    
    // All other values should remain unchanged
    for (let i = 0; i < 25; i++) {
      if (i !== 12) {
        expect(replaced[i]).toBe(false)
        expect(cleanedPct[i]).toBeCloseTo(3.96, 10)
      }
    }
  })

  test('handles zero MAD scenario gracefully', () => {
    const t0 = Date.now()
    // All values identical except spikes - causes MAD to be 0
    const points = Array.from({ length: 30 }, (_, i) => ({ 
      t: t0 + ms(i), 
      r: 5.0 
    }))
    // Add spikes
    points[10].r = 1000
    points[11].r = 1000
    
    const { cleanedPct, replaced } = cleanRateSeries(points)
    
    // Should handle zero MAD without crashing and replace spikes
    expect(replaced[10]).toBe(true)
    expect(replaced[11]).toBe(true)
    
    // Replaced values should be close to the constant value
    expect(cleanedPct[10]).toBeCloseTo(5.0, 1)
    expect(cleanedPct[11]).toBeCloseTo(5.0, 1)
  })

  test('handles contaminated median scenario', () => {
    const t0 = Date.now()
    // Many extreme values that could contaminate the median
    const points = [
      { t: t0, r: 5 },
      { t: t0 + ms(1), r: 5 },
      { t: t0 + ms(2), r: 5000 },
      { t: t0 + ms(3), r: 5000 },
      { t: t0 + ms(4), r: 5000 },
      { t: t0 + ms(5), r: 5 },
      { t: t0 + ms(6), r: 5 },
    ]
    
    const { cleanedPct, replaced } = cleanRateSeries(points, {
      win: 6,
      nSigmas: 3.0,
      maxRunToFix: 3
    })
    
    // Extreme values should be replaced despite being numerous
    expect(replaced[2]).toBe(true)
    expect(replaced[3]).toBe(true)
    expect(replaced[4]).toBe(true)
    
    // Cleaned values should be reasonable
    expect(cleanedPct[2]).toBeLessThan(100)
    expect(cleanedPct[3]).toBeLessThan(100)
    expect(cleanedPct[4]).toBeLessThan(100)
  })
})

describe('inferWindowSize', () => {
  test('infers window size for 10-minute data', () => {
    const t0 = Date.now()
    const timestamps = Array.from({ length: 100 }, (_, i) => t0 + i * 10 * 60 * 1000)
    
    expect(inferWindowSize(timestamps)).toBe(36) // ~6 hours of 10-min data
  })

  test('infers window size for hourly data', () => {
    const t0 = Date.now()
    const timestamps = Array.from({ length: 100 }, (_, i) => t0 + i * 60 * 60 * 1000)
    
    expect(inferWindowSize(timestamps)).toBe(24) // ~1 day of hourly data
  })

  test('infers window size for daily data', () => {
    const t0 = Date.now()
    const timestamps = Array.from({ length: 100 }, (_, i) => t0 + i * 24 * 60 * 60 * 1000)
    
    expect(inferWindowSize(timestamps)).toBe(7) // ~1 week of daily data
  })

  test('infers window size for weekly data', () => {
    const t0 = Date.now()
    const timestamps = Array.from({ length: 100 }, (_, i) => t0 + i * 7 * 24 * 60 * 60 * 1000)
    
    expect(inferWindowSize(timestamps)).toBe(4) // ~1 month of weekly data
  })

  test('returns default for insufficient data', () => {
    expect(inferWindowSize([])).toBe(24)
    expect(inferWindowSize([Date.now()])).toBe(24)
  })
})