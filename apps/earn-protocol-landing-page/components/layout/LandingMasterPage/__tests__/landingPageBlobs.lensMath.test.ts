import {
  chromaticDisplacements,
  LENS_ABERRATION,
  LENS_FALLOFF_RADIUS,
  LENS_MIN_DIST,
  lensDisplacement,
  lensFalloff,
} from '@/components/layout/LandingMasterPage/landingPageBlobs.lensMath'

describe('lensFalloff', () => {
  it('is 0 at and beyond the falloff radius', () => {
    expect(lensFalloff(LENS_FALLOFF_RADIUS)).toBe(0)
    expect(lensFalloff(1)).toBe(0)
  })

  it('is clamped to 1 at/below the minimum distance (no infinity at the center)', () => {
    expect(lensFalloff(0)).toBe(1)
    expect(lensFalloff(LENS_MIN_DIST)).toBe(1)
    expect(Number.isFinite(lensFalloff(0.000001))).toBe(true)
  })

  it('decreases monotonically with distance', () => {
    let prev = lensFalloff(LENS_MIN_DIST)

    for (let d = LENS_MIN_DIST; d <= LENS_FALLOFF_RADIUS; d += 0.01) {
      const cur = lensFalloff(d)

      expect(cur).toBeLessThanOrEqual(prev + 1e-12)
      prev = cur
    }
  })
})

describe('lensDisplacement', () => {
  it('is 0 at strength 0 and scales linearly with strength', () => {
    expect(lensDisplacement(0.1, 0)).toBe(0)
    expect(lensDisplacement(0.1, 1)).toBeCloseTo(lensDisplacement(0.1, 0.5) * 2, 10)
  })

  it('never displaces beyond the sampled distance (no UV overshoot past the well)', () => {
    for (let d = LENS_MIN_DIST; d <= LENS_FALLOFF_RADIUS; d += 0.01) {
      expect(lensDisplacement(d, 1)).toBeLessThanOrEqual(d)
    }
  })
})

describe('chromaticDisplacements', () => {
  it('spreads red outward and blue inward around green', () => {
    const { r, g, b } = chromaticDisplacements(0.1, 1)

    expect(g).toBeCloseTo(lensDisplacement(0.1, 1), 10)
    expect(r).toBeCloseTo(g * (1 + LENS_ABERRATION), 10)
    expect(b).toBeCloseTo(g * (1 - LENS_ABERRATION), 10)
  })

  it('collapses to no spread at strength 0', () => {
    expect(chromaticDisplacements(0.1, 0)).toEqual({ r: 0, g: 0, b: 0 })
  })
})
