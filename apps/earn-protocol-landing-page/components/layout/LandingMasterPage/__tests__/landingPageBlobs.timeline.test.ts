import {
  FINALE_CALM_END_S,
  FINALE_FLASH_END_S,
  FINALE_FLASH_START_S,
  finalePhase,
} from '@/components/layout/LandingMasterPage/landingPageBlobs.timeline'

describe('finalePhase', () => {
  it('is CALM with all terms zero before the calm end', () => {
    for (const t of [0, 1, FINALE_CALM_END_S - 0.01]) {
      expect(finalePhase(t)).toEqual({
        phase: 'CALM',
        collapseProgress: 0,
        flash: 0,
        lensStrength: 0,
        horizon: 0,
      })
    }
  })

  it('enters COLLAPSE exactly at the calm end and ramps to 1 at flash start', () => {
    const start = finalePhase(FINALE_CALM_END_S)
    const end = finalePhase(FINALE_FLASH_START_S - 0.001)

    expect(start.phase).toBe('COLLAPSE')
    expect(start.collapseProgress).toBeCloseTo(0, 2)
    expect(start.flash).toBe(0)
    expect(end.phase).toBe('COLLAPSE')
    expect(end.collapseProgress).toBeGreaterThan(0.99)
    expect(end.lensStrength).toBeGreaterThan(0.99)
  })

  it('collapseProgress and lensStrength are monotonic non-decreasing', () => {
    let prev = finalePhase(0)

    for (let t = 0; t <= FINALE_FLASH_END_S; t += 0.05) {
      const cur = finalePhase(t)

      expect(cur.collapseProgress).toBeGreaterThanOrEqual(prev.collapseProgress)
      expect(cur.lensStrength).toBeGreaterThanOrEqual(prev.lensStrength - 1e-9)
      expect(cur.horizon).toBeGreaterThanOrEqual(prev.horizon)
      prev = cur
    }
  })

  it('FLASH holds collapse at 1 with no blackout', () => {
    const mid = finalePhase((FINALE_FLASH_START_S + FINALE_FLASH_END_S) / 2)

    expect(mid.phase).toBe('FLASH')
    expect(mid.flash).toBe(0)
    expect(mid.collapseProgress).toBe(1)
    expect(mid.lensStrength).toBe(1)
    expect(mid.horizon).toBe(1)
  })

  it('AFTER holds the lens, hole and collapse at full strength forever, with no flash', () => {
    const early = finalePhase(FINALE_FLASH_END_S + 0.5)
    const late = finalePhase(FINALE_FLASH_END_S + 10000)

    expect(early.phase).toBe('AFTER')
    expect(early.flash).toBe(0)
    expect(late.flash).toBe(0)
    expect(early.lensStrength).toBe(1)
    expect(late.lensStrength).toBe(1)
    expect(early.horizon).toBe(1)
    expect(late.horizon).toBe(1)
    expect(late.phase).toBe('AFTER')
  })
})
