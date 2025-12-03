import { createTestSDK } from './utils/sdkInstance'
import { type TestConfigKey } from './utils/testConfig'
import { formatSumr } from './utils/stringifiers'
import { SECONDS_PER_DAY } from './utils/constants'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol Gov V2 Staking Earnings Estimation', () => {
  const sdk = createTestSDK()

  const scenarios: { testConfigKey: TestConfigKey }[] = [
    {
      testConfigKey: 'BaseUSDC',
    },
  ]

  // Define test stakes with different amounts, periods, and weighted amounts
  const stakes = [
    {
      amount: 100n * 10n ** 18n, // 100 SUMR
      period: 732n * SECONDS_PER_DAY, // 732 days (2 years)
      weightedAmount: 433n * 10n ** 18n, // 2x weight for 2 years
      description: 'Stake 1: 100 SUMR for 2 years (2x weight)',
    },
  ]

  describe.each(scenarios)('with scenario %#', (_scenario) => {
    it('should calculate earnings estimation for multiple stake positions', async () => {
      // Mock SUMR price (in production this would come from a price oracle)
      const sumrPriceUsd = 0.25 // Assume $0.25 per SUMR

      console.log('\nTesting earnings estimation for multiple stakes:')
      stakes.forEach((stake, index) => {
        console.log(`\nStake ${index + 1}: ${stake.description}`)
      })

      const earningsEstimation = await sdk.armada.users.getStakingEarningsEstimationV2({
        stakes,
        sumrPriceUsd,
      })

      // Validate the response structure
      expect(earningsEstimation).toBeDefined()
      expect(earningsEstimation.stakes).toBeDefined()
      expect(earningsEstimation.stakes).toHaveLength(stakes.length)

      // Validate each stake's earnings
      earningsEstimation.stakes.forEach((estimation, index) => {
        const stake = stakes[index]

        console.log(
          `\nStake ${index + 1} Earnings Estimation:` +
            `\n  Description: ${stake.description}` +
            `\n  SUMR Rewards: ${formatSumr(estimation.sumrRewardsAmount)} SUMR` +
            `\n  USD Earnings: ${estimation.usdEarningsAmount} USD`,
        )

        // Validate that earnings are non-negative
        expect(estimation.sumrRewardsAmount).toBeGreaterThanOrEqual(0n)
        expect(Number(estimation.usdEarningsAmount)).toBeGreaterThanOrEqual(0)

        // Higher weighted amounts should generally result in higher earnings
        // (assuming positive reward rates and revenue share)
        if (index > 0) {
          const prevStake = stakes[index - 1]

          // If this stake has more weighted amount than previous, it should have proportionally higher earnings
          if (stake.weightedAmount > prevStake.weightedAmount) {
            console.log(
              `\n  Note: Stake ${index + 1} has higher weighted amount than Stake ${index}, expecting proportionally higher rewards`,
            )
          }
        }
      })

      // Calculate and log total earnings across all stakes
      const totalSumrRewards = earningsEstimation.stakes.reduce(
        (sum, est) => sum + est.sumrRewardsAmount,
        0n,
      )
      const totalUsdEarnings = earningsEstimation.stakes.reduce(
        (sum, est) => sum + Number(est.usdEarningsAmount),
        0,
      )

      console.log(
        `\nTotal Earnings Across All Stakes:` +
          `\n  Total SUMR Rewards: ${formatSumr(totalSumrRewards)} SUMR` +
          `\n  Total USD Earnings: ${totalUsdEarnings} USD`,
      )

      expect(totalSumrRewards).toBeGreaterThanOrEqual(0n)
      expect(totalUsdEarnings).toBeGreaterThanOrEqual(0)
    })

    it('should use default SUMR price when not provided', async () => {
      const earningsEstimation = await sdk.armada.users.getStakingEarningsEstimationV2({
        stakes,
        // sumrPriceUsd not provided - should use default from utils
      })

      expect(earningsEstimation.stakes).toHaveLength(1)
      expect(earningsEstimation.stakes[0].sumrRewardsAmount).toBeGreaterThanOrEqual(0n)
      expect(Number(earningsEstimation.stakes[0].usdEarningsAmount)).toBeGreaterThanOrEqual(0)

      console.log(
        '\nEarnings with Default SUMR Price:' +
          `\n  SUMR Rewards: ${formatSumr(earningsEstimation.stakes[0].sumrRewardsAmount)} SUMR` +
          `\n  USD Earnings: ${earningsEstimation.stakes[0].usdEarningsAmount} USD`,
      )
    })
  })
})
