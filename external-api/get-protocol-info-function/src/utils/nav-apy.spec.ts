import { computeNavStaleness, navChangeAnnualised, navPriceChange24h } from './nav-apy'

const DAY = 86_400

// newest-first daily snapshots (as the subgraph query returns them, orderDirection: desc)
const snap = (pricePerShare: string | null, daysAgo: number) => ({
  pricePerShare,
  timestamp: String(1_000_000 - daysAgo * DAY),
})

describe('navPriceChange24h', () => {
  it('computes (latest - previous)/previous over the two newest snapshots', () => {
    expect(navPriceChange24h([snap('1.01', 0), snap('1.00', 1)])).toBeCloseTo(0.01, 10)
  })

  it('returns null with fewer than two snapshots', () => {
    expect(navPriceChange24h([])).toBeNull()
    expect(navPriceChange24h([snap('1.01', 0)])).toBeNull()
  })

  it('returns null when the previous price is <= 0 or non-finite', () => {
    expect(navPriceChange24h([snap('1.01', 0), snap('0', 1)])).toBeNull()
    expect(navPriceChange24h([snap('1.01', 0), snap(null, 1)])).toBeNull()
  })
})

describe('navChangeAnnualised (7d)', () => {
  it('annualises a full 7-day window: 7% over 7 days -> 3.65', () => {
    const snapshots = [
      snap('1.07', 0),
      snap('1.06', 1),
      snap('1.05', 2),
      snap('1.04', 3),
      snap('1.03', 4),
      snap('1.02', 5),
      snap('1.01', 6),
      snap('1.00', 7),
    ]
    // change = (1.07-1.00)/1.00 = 0.07 ; daysUsed = 7 ; apy = 0.07/7*365 = 3.65
    expect(navChangeAnnualised(snapshots, 7)).toBeCloseTo(3.65, 8)
  })

  it('picks the most recent snapshot at least 7 days old when extra history exists', () => {
    // 9 snapshots: day8 exists but the target is day7; result should use day7 (1.00), not day8.
    const snapshots = [
      snap('1.07', 0),
      snap('1.065', 1),
      snap('1.05', 2),
      snap('1.04', 3),
      snap('1.03', 4),
      snap('1.02', 5),
      snap('1.01', 6),
      snap('1.00', 7),
      snap('0.90', 8),
    ]
    expect(navChangeAnnualised(snapshots, 7)).toBeCloseTo(3.65, 8)
  })

  it('young-fleet fallback: only 2 snapshots 1 day apart annualises over the actual 1-day window', () => {
    // change = (1.01-1.00)/1.00 = 0.01 ; daysUsed = 1 ; apy = 0.01*365 = 3.65
    expect(navChangeAnnualised([snap('1.01', 0), snap('1.00', 1)], 7)).toBeCloseTo(3.65, 8)
  })

  it('returns null with fewer than two snapshots or a bad past price', () => {
    expect(navChangeAnnualised([snap('1.01', 0)], 7)).toBeNull()
    expect(navChangeAnnualised([snap('1.01', 0), snap('0', 7)], 7)).toBeNull()
  })
})

describe('computeNavStaleness', () => {
  const REF = 1_000_000 // reference block timestamp; snap(_, 0) has timestamp === REF

  it('is not stale when the newest snapshot is within 1 day of the subgraph head', () => {
    const result = computeNavStaleness({
      snapshots: [snap('1.01', 0), snap('1.00', 1)],
      subgraphBlockNumber: 123,
      subgraphBlockTimestamp: REF,
      nowSeconds: REF + 5 * DAY, // wall clock ignored when the subgraph reports a block timestamp
    })
    expect(result.isStale).toBe(false)
    expect(result.ageSeconds).toBe(0)
    expect(result.latestSnapshotTimestamp).toBe(REF)
    expect(result.subgraphBlockNumber).toBe(123)
    expect(result.subgraphBlockTimestamp).toBe(REF)
  })

  it('is stale when the newest snapshot is older than 1 day vs the subgraph head', () => {
    const result = computeNavStaleness({
      snapshots: [snap('1.01', 2), snap('1.00', 3)],
      subgraphBlockNumber: 123,
      subgraphBlockTimestamp: REF,
      nowSeconds: REF,
    })
    expect(result.isStale).toBe(true)
    expect(result.ageSeconds).toBe(2 * DAY)
  })

  it('treats missing snapshots as stale', () => {
    const result = computeNavStaleness({
      snapshots: [],
      subgraphBlockNumber: 1,
      subgraphBlockTimestamp: REF,
      nowSeconds: REF,
    })
    expect(result.isStale).toBe(true)
    expect(result.latestSnapshotTimestamp).toBeNull()
    expect(result.ageSeconds).toBeNull()
  })

  it('falls back to nowSeconds when the subgraph omits a block timestamp', () => {
    const result = computeNavStaleness({
      snapshots: [snap('1.01', 0)], // ts === REF
      subgraphBlockNumber: 5,
      subgraphBlockTimestamp: null,
      nowSeconds: REF + 2 * DAY,
    })
    expect(result.subgraphBlockTimestamp).toBeNull()
    expect(result.subgraphBlockNumber).toBe(5)
    expect(result.ageSeconds).toBe(2 * DAY)
    expect(result.isStale).toBe(true)
  })

  it('is not stale exactly at the threshold, stale one second past it', () => {
    const atThreshold = computeNavStaleness({
      snapshots: [{ pricePerShare: '1.0', timestamp: String(REF - DAY) }],
      subgraphBlockNumber: 1,
      subgraphBlockTimestamp: REF,
      nowSeconds: REF,
    })
    expect(atThreshold.ageSeconds).toBe(DAY)
    expect(atThreshold.isStale).toBe(false)

    const pastThreshold = computeNavStaleness({
      snapshots: [{ pricePerShare: '1.0', timestamp: String(REF - DAY - 1) }],
      subgraphBlockNumber: 1,
      subgraphBlockTimestamp: REF,
      nowSeconds: REF,
    })
    expect(pastThreshold.ageSeconds).toBe(DAY + 1)
    expect(pastThreshold.isStale).toBe(true)
  })
})
