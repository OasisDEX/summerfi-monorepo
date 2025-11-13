import { User, Address, getChainInfoByChainId } from '@summerfi/sdk-common'

import { createTestSDK } from './utils/sdkInstance'
import { SharedConfig, TestConfigs, type TestConfigKey } from './utils/testConfig'
import { formatSumr } from './utils/stringifiers'
import { SECONDS_PER_DAY } from './utils/constants'

jest.setTimeout(300000)

describe('Armada Protocol Gov V2 Staking Info', () => {
  const sdk = createTestSDK()

  const scenarios: { testConfigKey: TestConfigKey }[] = [
    {
      testConfigKey: 'BaseUSDC',
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { testConfigKey: chainConfigKey } = scenario
    const chainConfig = TestConfigs[chainConfigKey]
    const chainInfo = getChainInfoByChainId(chainConfig.chainId)
    const userAddress = Address.createFromEthereum({ value: SharedConfig.userAddressValue })
    const user = User.createFromEthereum(chainInfo.chainId, userAddress.value)

    it('should get staking buckets info', async () => {
      const bucketsInfo = await sdk.armada.users.getStakingBucketsInfoV2()

      expect(bucketsInfo).toBeDefined()
      expect(Array.isArray(bucketsInfo)).toBe(true)
      expect(bucketsInfo.length).toBeGreaterThan(0)

      const bucketMessages = bucketsInfo
        .map((bucketInfo) => {
          const capSumr = formatSumr(bucketInfo.cap)
          const totalStakedSumr = formatSumr(bucketInfo.totalStaked)
          const minLockupDays = bucketInfo.minLockupPeriod / SECONDS_PER_DAY
          const maxLockupDays = bucketInfo.maxLockupPeriod / SECONDS_PER_DAY

          return (
            `Bucket ${bucketInfo.bucket}: cap=${capSumr} SUMR, ` +
            `totalStaked=${totalStakedSumr} SUMR, ` +
            `minLockup=${minLockupDays.toString()} days, ` +
            `maxLockup=${maxLockupDays.toString()} days`
          )
        })
        .join('\n')

      console.log(bucketMessages)
    })

    it('should show user SUMR balance', async () => {
      const sumrBalanceBefore = await sdk.armada.users.getUserBalance({ user })
      console.log('SUMR balance before: ', formatSumr(sumrBalanceBefore) + ' SUMR')
    })

    it('should get user staking balance', async () => {
      const balances = await sdk.armada.users.getUserStakingBalanceV2({ user })

      expect(balances).toBeDefined()
      expect(Array.isArray(balances)).toBe(true)
      expect(balances.length).toBeGreaterThan(0)

      const balanceMessages = balances
        .map((b) => {
          const amount = formatSumr(b.amount)
          const bucket = b.bucket
          return `Bucket ${bucket}: amount=${amount} SUMR`
        })
        .join('\n')

      console.log(balanceMessages)
    })

    it('should get user weighted staking balance', async () => {
      const weightedBalance = await sdk.armada.users.getUserStakingWeightedBalanceV2({ user })

      console.log('User weighted balance:', formatSumr(weightedBalance))
      expect(weightedBalance).toBeGreaterThanOrEqual(0n)
    })

    it('should get user staking earned rewards', async () => {
      // Get SUMR token address as reward token
      const summerToken = await sdk.armada.users.getSummerToken({ chainInfo })

      const earned = await sdk.armada.users.getUserStakingEarnedV2({
        user,
        rewardTokenAddress: summerToken.address,
      })

      console.log('User earned rewards:', formatSumr(earned))
      expect(earned).toBeGreaterThanOrEqual(0n)
    })

    it('should get staking reward rates', async () => {
      // Get SUMR token address as reward token
      const summerToken = await sdk.armada.users.getSummerToken({ chainInfo })

      const rewardRates = await sdk.armada.users.getStakingRewardRatesV2({
        user,
        rewardTokenAddress: summerToken.address,
      })

      console.log('Reward rates for user:', rewardRates)
      expect(rewardRates).toBeDefined()
      expect(rewardRates.summerRewardAPY).toBeGreaterThanOrEqual(0)
      expect(rewardRates.usdcYieldAPY).toBeGreaterThanOrEqual(0)
      expect(rewardRates.boostedMultiplier).toBeGreaterThanOrEqual(1) // Should be >= 1x
    })

    it('should calculate weighted stake for a given amount and lockup period', async () => {
      // Test with 1000 SUMR and 100 days lockup
      const amount = 1000n * 10n ** 18n // 1000 SUMR (18 decimals)
      const lockupDays = 666n

      const weightedStake = await sdk.armada.users.getStakingCalculateWeightedStakeV2({
        amount,
        lockupPeriod: lockupDays * SECONDS_PER_DAY,
      })

      console.log(
        `Weighted stake for ${formatSumr(amount)} SUMR with ${lockupDays} days lockup: ${formatSumr(weightedStake)} weighted SUMR`,
      )
      expect(weightedStake).toBeGreaterThanOrEqual(amount) // Weighted stake should be >= original amount
    })

    it('should get total weighted supply', async () => {
      const totalWeightedSupply = await sdk.armada.users.getStakingTotalWeightedSupplyV2()

      console.log('Total weighted supply:', formatSumr(totalWeightedSupply), 'weighted SUMR')
      expect(totalWeightedSupply).toBeGreaterThanOrEqual(0n)
    })

    it('should get total SUMR staked across all buckets', async () => {
      const totalSumrStaked = await sdk.armada.users.getStakingTotalSumrStakedV2()

      console.log('Total SUMR staked across all buckets:', formatSumr(totalSumrStaked), 'SUMR')
      expect(totalSumrStaked).toBeGreaterThanOrEqual(0n)
    })

    it('should get staking revenue share percentage', async () => {
      const revenueShare = await sdk.armada.users.getStakingRevenueShareV2()

      console.log('Staking revenue share:', revenueShare.value, '%')
      expect(revenueShare.value).toBeGreaterThan(0)
      expect(revenueShare.value).toBeLessThanOrEqual(100)
    })

    it('should get staking revenue amount', async () => {
      const revenueAmount = await sdk.armada.users.getStakingRevenueAmountV2()

      console.log('Staking revenue amount:', revenueAmount.toLocaleString(), 'USD')
      expect(revenueAmount).toBeGreaterThanOrEqual(0)
    })
  })
})
