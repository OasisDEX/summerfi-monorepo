import { type GetVaultQueryRwa } from '@summerfi/subgraph-manager-common'

import { getNavPriceChange24h } from '@/helpers/get-nav-price-change-24h'

type Vault = GetVaultQueryRwa['vault']

const makeVault = (snapshots: { pricePerShare?: string | null; timestamp?: bigint }[]): Vault =>
  ({
    dailySnapshots: snapshots,
  }) as Vault

describe('getNavPriceChange24h', () => {
  it('returns null when there are fewer than two snapshots', () => {
    expect(getNavPriceChange24h(makeVault([{ pricePerShare: '1.05' }]))).toBeNull()
    expect(getNavPriceChange24h(makeVault([]))).toBeNull()
  })

  it('returns null when the vault/snapshots are missing entirely', () => {
    expect(getNavPriceChange24h(undefined)).toBeNull()
    expect(getNavPriceChange24h({} as Vault)).toBeNull()
  })

  it('returns null when a price is missing or non-numeric', () => {
    expect(
      getNavPriceChange24h(makeVault([{ pricePerShare: null }, { pricePerShare: '1.0' }])),
    ).toBeNull()
    expect(
      getNavPriceChange24h(
        makeVault([{ pricePerShare: '1.05' }, { pricePerShare: 'not-a-number' }]),
      ),
    ).toBeNull()
  })

  it('returns null when the previous price is zero (avoids division by zero)', () => {
    expect(
      getNavPriceChange24h(makeVault([{ pricePerShare: '1.05' }, { pricePerShare: '0' }])),
    ).toBeNull()
  })

  it('computes a positive day-over-day change as a decimal fraction', () => {
    const result = getNavPriceChange24h(
      makeVault([{ pricePerShare: '1.05' }, { pricePerShare: '1.00' }]),
    )

    expect(result).toBeCloseTo(0.05, 10)
  })

  it('computes a negative day-over-day change when price decreased', () => {
    const result = getNavPriceChange24h(
      makeVault([{ pricePerShare: '0.98' }, { pricePerShare: '1.00' }]),
    )

    expect(result).toBeCloseTo(-0.02, 10)
  })

  it('ignores any snapshots beyond the first two', () => {
    const result = getNavPriceChange24h(
      makeVault([{ pricePerShare: '1.10' }, { pricePerShare: '1.00' }, { pricePerShare: '0.50' }]),
    )

    expect(result).toBeCloseTo(0.1, 10)
  })
})
