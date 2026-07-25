import { createEnvelope } from '@/components/layout/LandingMasterPage/landingPageBlobs.envelope'

describe('createEnvelope', () => {
  it('starts at initial value and returns current from update', () => {
    const env = createEnvelope({ attackRate: 2, releaseRate: 1, initial: 0.5 })

    expect(env.current).toBe(0.5)
    expect(env.update(0)).toBe(0.5)
  })

  it('converges to the target', () => {
    const env = createEnvelope({ attackRate: 2, releaseRate: 1 })

    env.target = 1
    for (let i = 0; i < 600; i++) env.update(1 / 60)
    expect(env.current).toBeCloseTo(1, 4)
  })

  it('attacks faster than it releases', () => {
    const rise = createEnvelope({ attackRate: 3, releaseRate: 0.5 })
    const fall = createEnvelope({ attackRate: 3, releaseRate: 0.5, initial: 1 })

    rise.target = 1
    fall.target = 0
    rise.update(0.5)
    fall.update(0.5)
    // rise covered more of its gap than fall did of its gap
    expect(rise.current).toBeGreaterThan(1 - fall.current)
  })

  it('is framerate independent: many small steps equal one big step', () => {
    const fine = createEnvelope({ attackRate: 2, releaseRate: 1 })
    const coarse = createEnvelope({ attackRate: 2, releaseRate: 1 })

    fine.target = 1
    coarse.target = 1
    for (let i = 0; i < 100; i++) fine.update(0.01)
    coarse.update(1)
    expect(fine.current).toBeCloseTo(coarse.current, 6)
  })

  it('never overshoots the target', () => {
    const env = createEnvelope({ attackRate: 50, releaseRate: 50 })

    env.target = 1
    env.update(10)
    expect(env.current).toBeLessThanOrEqual(1)
    env.target = 0
    env.update(10)
    expect(env.current).toBeGreaterThanOrEqual(0)
  })
})
