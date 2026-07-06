import { type GetVaultQueryRwa } from '@summerfi/subgraph-manager-common'

import { getNavPriceChange30d } from '@/helpers/get-nav-price-change-30d'

type Vault = GetVaultQueryRwa['vault']

const SECONDS_PER_DAY = 86_400
const DAY = BigInt(SECONDS_PER_DAY)

// Offset helpers keep the multiplication and the +/- on separate statements so no
// single expression mixes operators (satisfies eslint no-mixed-operators + prettier).
const daysBefore = (base: bigint, days: number): bigint => {
  const offset = BigInt(days) * DAY

  return base - offset
}

const daysAfter = (base: bigint, days: number): bigint => {
  const offset = BigInt(days) * DAY

  return base + offset
}

const makeVault = (
  snapshots: { pricePerShare?: string | null; timestamp: bigint }[],
  createdTimestamp?: bigint,
): Vault =>
  ({
    dailySnapshots: snapshots,
    createdTimestamp,
  }) as Vault

describe('getNavPriceChange30d', () => {
  it('returns null when there are fewer than two snapshots', () => {
    expect(getNavPriceChange30d(makeVault([{ pricePerShare: '1.05', timestamp: 100n }]))).toBeNull()
    expect(getNavPriceChange30d(makeVault([]))).toBeNull()
  })

  it('returns null when the latest price is missing, non-numeric, or non-positive', () => {
    expect(
      getNavPriceChange30d(
        makeVault([
          { pricePerShare: null, timestamp: 200n },
          { pricePerShare: '1.00', timestamp: 100n },
        ]),
      ),
    ).toBeNull()
    expect(
      getNavPriceChange30d(
        makeVault([
          { pricePerShare: '0', timestamp: 200n },
          { pricePerShare: '1.00', timestamp: 100n },
        ]),
      ),
    ).toBeNull()
  })

  it('falls back to the oldest snapshot and flags isPartial when the vault is younger than 30 days', () => {
    const latestTs = 1_700_000_000n
    // 5 daily snapshots, newest first, spanning only 5 days of history.
    const snapshots = [
      { pricePerShare: '1.05', timestamp: latestTs },
      { pricePerShare: '1.04', timestamp: daysBefore(latestTs, 1) },
      { pricePerShare: '1.03', timestamp: daysBefore(latestTs, 2) },
      { pricePerShare: '1.02', timestamp: daysBefore(latestTs, 3) },
      { pricePerShare: '1.00', timestamp: daysBefore(latestTs, 5) },
    ]

    const result = getNavPriceChange30d(makeVault(snapshots))

    expect(result).not.toBeNull()
    expect(result?.isPartial).toBe(true)
    expect(result?.daysUsed).toBe(5)
    expect(result?.change).toBeCloseTo((1.05 - 1.0) / 1.0, 10)
    expect(result?.apy).toBeCloseTo(((1.05 - 1.0) / 1.0 / 5) * 365, 8)
  })

  it('picks the most recent snapshot at least 30 days old and reports isPartial=false', () => {
    const latestTs = 1_700_000_000n
    const pastTs = daysBefore(latestTs, 31)
    const snapshots = [
      { pricePerShare: '1.062', timestamp: latestTs },
      { pricePerShare: '1.000', timestamp: pastTs },
    ]

    const result = getNavPriceChange30d(makeVault(snapshots))

    expect(result?.isPartial).toBe(false)
    expect(result?.daysUsed).toBe(31)
    expect(result?.change).toBeCloseTo((1.062 - 1.0) / 1.0, 10)
    expect(result?.apy).toBeCloseTo(((1.062 - 1.0) / 1.0 / 31) * 365, 8)
  })

  it('excludes snapshots before createdTimestamp + skipFirstNDays when enough data remains', () => {
    const created = 1_000n
    // newest -> oldest
    const snapshots = [
      { pricePerShare: '1.10', timestamp: daysAfter(created, 3) },
      { pricePerShare: '1.08', timestamp: daysAfter(created, 2) }, // == cutoff for skip=2, kept
      { pricePerShare: '1.05', timestamp: daysAfter(created, 1) }, // trimmed away for skip=2
      { pricePerShare: '1.00', timestamp: created }, // trimmed away for skip=2
    ]
    const vault = makeVault(snapshots, created)

    const withoutSkip = getNavPriceChange30d(vault, 0)
    const withSkip = getNavPriceChange30d(vault, 2)

    // Without skipping, the oldest snapshot (1.00, 3 days back) is used as "past".
    expect(withoutSkip?.daysUsed).toBe(3)
    expect(withoutSkip?.change).toBeCloseTo((1.1 - 1.0) / 1.0, 10)

    // With the first 2 days skipped, the oldest *remaining* snapshot (1.08, 1 day back) is used.
    expect(withSkip?.daysUsed).toBe(1)
    expect(withSkip?.change).toBeCloseTo((1.1 - 1.08) / 1.08, 10)
  })

  it('ignores skipFirstNDays when it would leave fewer than two snapshots (falls back to full history)', () => {
    const created = 1_000n
    const snapshots = [
      { pricePerShare: '1.10', timestamp: daysAfter(created, 3) },
      { pricePerShare: '1.08', timestamp: daysAfter(created, 2) },
      { pricePerShare: '1.05', timestamp: daysAfter(created, 1) },
      { pricePerShare: '1.00', timestamp: created },
    ]
    const vault = makeVault(snapshots, created)

    const withoutSkip = getNavPriceChange30d(vault, 0)
    // A huge skip would trim away every snapshot (including the latest) -> falls back to full history.
    const withHugeSkip = getNavPriceChange30d(vault, 100)

    expect(withHugeSkip).toEqual(withoutSkip)
  })
})
