import { calculateOverallSumr } from '@/helpers/calculate-overall-sumr'

// Minimal shape matching the fields `calculateOverallSumr` actually reads off
// `ClaimDelegateExternalData` (sumrBalances.total/vested, sumrStakeDelegate.stakedAmount,
// sumrToClaim.aggregatedRewards.total). The full type pulls in server-handler types we don't
// need to construct for a pure-function test.
type MinimalRewardsData = {
  sumrBalances: { total: string; vested: string }
  sumrStakeDelegate: { stakedAmount: string }
  sumrToClaim: { aggregatedRewards: { total: number } }
}

const makeRewardsData = (overrides: Partial<MinimalRewardsData> = {}): MinimalRewardsData => ({
  sumrBalances: { total: '0', vested: '0' },
  sumrStakeDelegate: { stakedAmount: '0' },
  sumrToClaim: { aggregatedRewards: { total: 0 } },
  ...overrides,
})

describe('calculateOverallSumr', () => {
  it('sums balances, vested, staked and claimable rewards', () => {
    const rewardsData = makeRewardsData({
      sumrBalances: { total: '100', vested: '25.5' },
      sumrStakeDelegate: { stakedAmount: '50' },
      sumrToClaim: { aggregatedRewards: { total: 10 } },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(calculateOverallSumr(rewardsData as any)).toBe(100 + 25.5 + 50 + 10)
  })

  it('returns 0 when every input is zero', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(calculateOverallSumr(makeRewardsData() as any)).toBe(0)
  })

  it('treats non-numeric string balances as NaN (propagates, does not silently coerce to 0)', () => {
    const rewardsData = makeRewardsData({ sumrBalances: { total: 'not-a-number', vested: '1' } })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(calculateOverallSumr(rewardsData as any)).toBeNaN()
  })

  it('handles decimal precision without dropping fractional amounts', () => {
    const rewardsData = makeRewardsData({
      sumrBalances: { total: '0.1', vested: '0.2' },
      sumrStakeDelegate: { stakedAmount: '0' },
      sumrToClaim: { aggregatedRewards: { total: 0 } },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(calculateOverallSumr(rewardsData as any)).toBeCloseTo(0.3, 10)
  })
})
