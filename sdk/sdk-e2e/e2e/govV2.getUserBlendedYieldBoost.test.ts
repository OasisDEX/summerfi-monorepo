import { User, Address, getChainInfoByChainId } from '@summerfi/sdk-common'

import { createTestSdkInstance } from './utils/createTestSdkInstance'
import { SharedConfig, TestConfigs, type TestConfigKey } from './utils/testConfig'

jest.setTimeout(300000)

describe('Armada Protocol Gov V2 getUserBlendedYieldBoost', () => {
  const sdk = createTestSdkInstance()

  const scenarios: { testConfigKey: TestConfigKey }[] = [
    {
      testConfigKey: 'BaseUSDC',
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { testConfigKey: chainConfigKey } = scenario
    const chainConfig = TestConfigs[chainConfigKey]
    const chainInfo = getChainInfoByChainId(chainConfig.chainId)
    const userAddress = Address.createFromEthereum({ value: SharedConfig.testUserAddressValue })
    const user = User.createFromEthereum(chainInfo.chainId, userAddress.value)

    it('should get user blended yield boost', async () => {
      const blendedYieldBoost = await sdk.armada.users.getUserBlendedYieldBoost({ user })

      expect(blendedYieldBoost).toBeDefined()
      expect(typeof blendedYieldBoost).toBe('number')
      expect(blendedYieldBoost).toBeGreaterThanOrEqual(0)

      console.log('User blended yield boost:', blendedYieldBoost)

      // Verify the calculation manually
      const userWeightedBalance = await sdk.armada.users.getUserStakingWeightedBalanceV2({ user })
      const userSumrStaked = await sdk.armada.users.getUserStakingSumrStaked({ user })

      console.log('User weighted balance:', userWeightedBalance.toString())
      console.log('User SUMR staked:', userSumrStaked.toString())

      // If user has staked balance, verify the calculation
      if (userSumrStaked > 0n) {
        const calculatedBoost = Number(userWeightedBalance) / Number(userSumrStaked)
        console.log('Calculated boost:', calculatedBoost)

        // Allow for small floating point differences
        expect(Math.abs(blendedYieldBoost - calculatedBoost)).toBeLessThan(0.0001)
      } else {
        // If no staked balance, boost should be 0
        expect(blendedYieldBoost).toBe(0)
      }
    })

    it('should return 0 for user with no stakes', async () => {
      // Create a new random user that likely has no stakes
      const randomAddress = Address.createFromEthereum({
        value: '0x0000000000000000000000000000000000000001',
      })
      const randomUser = User.createFromEthereum(chainInfo.chainId, randomAddress.value)

      const blendedYieldBoost = await sdk.armada.users.getUserBlendedYieldBoost({
        user: randomUser,
      })

      expect(blendedYieldBoost).toBeDefined()
      expect(typeof blendedYieldBoost).toBe('number')
      expect(blendedYieldBoost).toBe(0)

      console.log('Random user blended yield boost:', blendedYieldBoost)
    })

    it('should calculate boost correctly based on weighted balance formula', async () => {
      const blendedYieldBoost = await sdk.armada.users.getUserBlendedYieldBoost({ user })
      const userWeightedBalance = await sdk.armada.users.getUserStakingWeightedBalanceV2({ user })
      const balances = await sdk.armada.users.getUserStakingBalanceV2({ user })

      // Calculate total staked manually
      const userSumrStaked = balances.reduce((sum, balance) => sum + balance.amount, 0n)

      console.log('Blended yield boost from method:', blendedYieldBoost)
      console.log('User weighted balance:', userWeightedBalance.toString())
      console.log('User SUMR staked:', userSumrStaked.toString())

      if (userSumrStaked > 0n) {
        // Manual calculation: userWeightedBalance / userSumrStakedBalance
        const manualBoost = Number(userWeightedBalance) / Number(userSumrStaked)
        console.log('Manual boost calculation:', manualBoost)

        // Allow for small floating point differences
        expect(Math.abs(blendedYieldBoost - manualBoost)).toBeLessThan(0.0001)
      } else {
        expect(blendedYieldBoost).toBe(0)
      }
    })
  })
})
