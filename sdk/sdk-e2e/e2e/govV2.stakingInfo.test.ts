import { User, Address, getChainInfoByChainId } from '@summerfi/sdk-common'

import { createTestSDK } from './utils/sdkInstance'
import { SharedConfig, TestConfigs, type TestConfigKey } from './utils/testConfig'

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

      bucketsInfo.forEach((bucketInfo) => {
        console.log(
          `Bucket ${bucketInfo.bucket}: cap=${bucketInfo.cap.toString()}, ` +
            `totalStaked=${bucketInfo.totalStaked.toString()}, ` +
            `minLockup=${bucketInfo.minLockupPeriod.toString()}s, ` +
            `maxLockup=${bucketInfo.maxLockupPeriod.toString()}s`,
        )
      })
    })

    it('should get user weighted staking balance', async () => {
      const weightedBalance = await sdk.armada.users.getUserStakingWeightedBalanceV2({ user })

      console.log('User weighted balance:', weightedBalance.toString())
      expect(weightedBalance).toBeGreaterThanOrEqual(0n)
    })

    it('should get user staking earned rewards', async () => {
      // Get SUMR token address as reward token
      const summerToken = await sdk.armada.users.getSummerToken({ chainInfo })

      const earned = await sdk.armada.users.getUserStakingEarnedV2({
        user,
        rewardTokenAddress: summerToken.address,
      })

      console.log('User earned rewards:', earned.toString())
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
  })
})
