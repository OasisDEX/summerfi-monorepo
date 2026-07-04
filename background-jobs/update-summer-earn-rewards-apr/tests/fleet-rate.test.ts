import {
  computeFleetArksTotalRates,
  computeWeightedFleetRate,
  FleetArkTotalRate,
} from '../src/fleet-rate'

type Product = { id: string; interestRates: Array<{ rate: string | number }> }

const product = (id: string, rate?: string | number): Product => ({
  id,
  interestRates: rate === undefined ? [] : [{ rate }],
})

describe('computeFleetArksTotalRates', () => {
  it('uses the subgraph rate as the base when it is present and non-zero', () => {
    const result = computeFleetArksTotalRates({
      products: [product('p1', 0.05)],
      rewardRatesByProductId: new Map(),
      offchainRatesByProductId: new Map(),
    })

    expect(result).toEqual<FleetArkTotalRate[]>([
      { productId: 'p1', baseRate: 0.05, offchainRate: undefined, rewardRate: 0, totalRate: 0.05 },
    ])
  })

  it('coerces string subgraph rates to numbers', () => {
    const result = computeFleetArksTotalRates({
      products: [product('p1', '0.05')],
      rewardRatesByProductId: new Map(),
      offchainRatesByProductId: new Map(),
    })

    expect(result[0].baseRate).toBe(0.05)
  })

  it('falls back to the offchain rate when the subgraph has no interest rate', () => {
    const result = computeFleetArksTotalRates({
      products: [product('p1')],
      rewardRatesByProductId: new Map(),
      offchainRatesByProductId: new Map([['p1', 0.042]]),
    })

    expect(result).toEqual<FleetArkTotalRate[]>([
      { productId: 'p1', baseRate: 0.042, offchainRate: 0.042, rewardRate: 0, totalRate: 0.042 },
    ])
  })

  it('falls back to the offchain rate when the subgraph rate is zero', () => {
    const result = computeFleetArksTotalRates({
      products: [product('p1', 0)],
      rewardRatesByProductId: new Map(),
      offchainRatesByProductId: new Map([['p1', 0.042]]),
    })

    expect(result[0].baseRate).toBe(0.042)
    expect(result[0].offchainRate).toBe(0.042)
  })

  it('prefers a non-zero subgraph rate over an available offchain rate', () => {
    const result = computeFleetArksTotalRates({
      products: [product('p1', 0.05)],
      rewardRatesByProductId: new Map(),
      offchainRatesByProductId: new Map([['p1', 0.042]]),
    })

    // Subgraph wins, but the offchain sample is still surfaced for observability.
    expect(result[0].baseRate).toBe(0.05)
    expect(result[0].offchainRate).toBe(0.042)
  })

  it('adds the reward rate to the base rate', () => {
    const result = computeFleetArksTotalRates({
      products: [product('p1', 0.05)],
      rewardRatesByProductId: new Map([['p1', 0.01]]),
      offchainRatesByProductId: new Map(),
    })

    expect(result[0].rewardRate).toBe(0.01)
    expect(result[0].totalRate).toBeCloseTo(0.06)
  })

  it('adds the reward rate on top of an offchain base rate', () => {
    const result = computeFleetArksTotalRates({
      products: [product('p1')],
      rewardRatesByProductId: new Map([['p1', 0.01]]),
      offchainRatesByProductId: new Map([['p1', 0.042]]),
    })

    expect(result[0].totalRate).toBeCloseTo(0.052)
  })

  it('drops products with no base rate from either source and reports them', () => {
    const onMissingBaseRate = jest.fn()
    const result = computeFleetArksTotalRates({
      products: [product('p1', 0.05), product('missing')],
      rewardRatesByProductId: new Map([['missing', 0.01]]),
      offchainRatesByProductId: new Map(),
      onMissingBaseRate,
    })

    expect(result.map((r) => r.productId)).toEqual(['p1'])
    expect(onMissingBaseRate).toHaveBeenCalledTimes(1)
    expect(onMissingBaseRate).toHaveBeenCalledWith('missing')
  })

  it('drops a product whose subgraph rate is non-numeric and has no offchain fallback', () => {
    const onMissingBaseRate = jest.fn()
    const result = computeFleetArksTotalRates({
      products: [product('p1', 'n/a')],
      rewardRatesByProductId: new Map(),
      offchainRatesByProductId: new Map(),
      onMissingBaseRate,
    })

    // +'n/a' is NaN; treated as missing rather than poisoning the fleet rate.
    expect(result).toEqual([])
    expect(onMissingBaseRate).toHaveBeenCalledWith('p1')
  })

  it('falls back to the offchain rate when the subgraph rate is non-numeric', () => {
    const result = computeFleetArksTotalRates({
      products: [product('p1', 'n/a')],
      rewardRatesByProductId: new Map(),
      offchainRatesByProductId: new Map([['p1', 0.042]]),
    })

    expect(result[0].baseRate).toBe(0.042)
    expect(result[0].totalRate).toBe(0.042)
  })

  it('never emits a non-finite totalRate even with a NaN reward rate present', () => {
    const result = computeFleetArksTotalRates({
      products: [product('p1', 0.05)],
      rewardRatesByProductId: new Map(),
      offchainRatesByProductId: new Map(),
    })

    expect(Number.isFinite(result[0].totalRate)).toBe(true)
  })

  it('keeps a product whose base and reward rates are both zero (totalRate 0)', () => {
    // `rewardRate + baseRate || baseRate` collapses to baseRate when the sum is
    // falsy, so a zero subgraph rate with an offchain fallback of 0 still yields
    // a retained product contributing 0.
    const result = computeFleetArksTotalRates({
      products: [product('p1', 0)],
      rewardRatesByProductId: new Map([['p1', 0]]),
      offchainRatesByProductId: new Map([['p1', 0]]),
    })

    expect(result).toHaveLength(1)
    expect(result[0].totalRate).toBe(0)
  })

  it('handles a mixed fleet of on-chain and offchain arks', () => {
    const result = computeFleetArksTotalRates({
      products: [product('onchain', 0.05), product('rwa')],
      rewardRatesByProductId: new Map([['onchain', 0.01]]),
      offchainRatesByProductId: new Map([['rwa', 0.04]]),
    })

    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({
      productId: 'onchain',
      baseRate: 0.05,
      offchainRate: undefined,
      rewardRate: 0.01,
    })
    expect(result[0].totalRate).toBeCloseTo(0.06)
    expect(result[1]).toEqual<FleetArkTotalRate>({
      productId: 'rwa',
      baseRate: 0.04,
      offchainRate: 0.04,
      rewardRate: 0,
      totalRate: 0.04,
    })
  })
})

describe('computeWeightedFleetRate', () => {
  it('returns the TVL-weighted average of the total rates', () => {
    const rate = computeWeightedFleetRate(
      [
        { productId: 'p1', totalRate: 0.06 },
        { productId: 'p2', totalRate: 0.04 },
      ],
      new Map([
        ['p1', 0.25],
        ['p2', 0.75],
      ]),
    )

    // 0.06 * 0.25 + 0.04 * 0.75
    expect(rate).toBeCloseTo(0.045)
  })

  it('returns 0 for an empty fleet', () => {
    expect(computeWeightedFleetRate([], new Map())).toBe(0)
  })

  it('ignores products whose ratio is unknown instead of producing NaN', () => {
    const rate = computeWeightedFleetRate(
      [
        { productId: 'p1', totalRate: 0.06 },
        { productId: 'orphan', totalRate: 0.5 },
      ],
      new Map([['p1', 1]]),
    )

    expect(rate).toBeCloseTo(0.06)
  })

  it('equals the single rate when one ark holds the whole fleet', () => {
    const rate = computeWeightedFleetRate(
      [{ productId: 'p1', totalRate: 0.073 }],
      new Map([['p1', 1]]),
    )
    expect(rate).toBeCloseTo(0.073)
  })
})
