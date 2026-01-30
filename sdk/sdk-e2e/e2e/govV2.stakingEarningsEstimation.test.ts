import { createTestSDK } from './utils/sdkInstance'
import { SharedConfig } from './utils/testConfig'
import { formatSumr } from './utils/stringifiers'
import { SECONDS_PER_DAY } from './utils/constants'
import { ChainIds, User, type AddressValue } from '@summerfi/sdk-common'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol Gov V2 Staking Earnings Estimation', () => {
  const sdk = createTestSDK()

  const scenarios: { chainId: number; userAddressValue: AddressValue }[] = [
    {
      chainId: ChainIds.Base,
      userAddressValue: SharedConfig.testUserAddressValue,
    },
  ]

  describe.each(scenarios)('with scenario %#', (_scenario) => {
    it('should calculate earnings estimation for user stakes', async () => {
      // Mock SUMR price (in production this would come from a price oracle)
      const sumrPriceUsd = 0.25 // Assume $0.25 per SUMR

      // const stakes = await sdk.armada.users.getUserStakesV2({
      //   user: User.createFromEthereum(_scenario.chainId, _scenario.userAddressValue),
      // })
      const stakes = await sdk.armada.users.getStakingStakesV2()

      console.log('\nTesting earnings estimation for multiple stakes:')
      stakes.forEach((stake, index) => {
        console.log(
          `\nStake ${index + 1}: ${formatSumr(stake.amount)} SUMR, Lockup: ${stake.lockupPeriod / SECONDS_PER_DAY} days, Weighted Amount: ${formatSumr(stake.weightedAmount)} SUMR`,
        )
      })

      const earningsEstimation = await sdk.armada.users.getStakingEarningsEstimationV2({
        stakes: stakes.map((stake) => ({
          id: stake.id,
          weightedAmount: stake.weightedAmount.toString(),
        })),
        sumrPriceUsd,
      })

      // Validate the response structure
      expect(earningsEstimation).toBeDefined()
      expect(earningsEstimation.stakes).toBeDefined()
      expect(earningsEstimation.stakes).toHaveLength(stakes.length)

      // Validate each stake's earnings
      earningsEstimation.stakes.forEach((estimation, index) => {
        console.log(
          `\nStake ${index + 1} Earnings Estimation:` +
            `\n  SUMR Rewards: ${formatSumr(estimation.sumrRewardsAmount)} SUMR` +
            `\n  USD Earnings: ${estimation.usdEarningsAmount} USD`,
        )

        // Validate that earnings are non-negative
        expect(estimation.sumrRewardsAmount).toBeGreaterThanOrEqual(0n)
        expect(Number(estimation.usdEarningsAmount)).toBeGreaterThanOrEqual(0)
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
  })
})
