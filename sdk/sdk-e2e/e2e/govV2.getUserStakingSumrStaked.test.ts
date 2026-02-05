import { User, Address, getChainInfoByChainId } from '@summerfi/sdk-common'

import { createTestSdkInstance } from './utils/createTestSdkInstance'
import { SharedConfig, TestConfigs, type TestConfigKey } from './utils/testConfig'

jest.setTimeout(300000)

describe('Armada Protocol Gov V2 getUserStakingSumrStaked', () => {
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

    it('should get user total staked SUMR', async () => {
      const totalStaked = await sdk.armada.users.getUserStakingSumrStaked({ user })

      expect(totalStaked).toBeDefined()
      expect(typeof totalStaked).toBe('bigint')
      expect(totalStaked).toBeGreaterThanOrEqual(0n)

      console.log('User total staked SUMR:', totalStaked.toString())

      // Also get the balance by bucket to verify the total
      const balances = await sdk.armada.users.getUserStakingBalanceV2({ user })
      const calculatedTotal = balances.reduce((sum, balance) => sum + balance.amount, 0n)

      console.log('Calculated total from balances:', calculatedTotal.toString())

      // The total should match the sum of all bucket balances
      expect(totalStaked).toBe(calculatedTotal)
    })

    it('should return 0 for user with no stakes', async () => {
      // Create a new random user that likely has no stakes
      const randomAddress = Address.createFromEthereum({
        value: '0x0000000000000000000000000000000000000001',
      })
      const randomUser = User.createFromEthereum(chainInfo.chainId, randomAddress.value)

      const totalStaked = await sdk.armada.users.getUserStakingSumrStaked({ user: randomUser })

      expect(totalStaked).toBeDefined()
      expect(typeof totalStaked).toBe('bigint')
      expect(totalStaked).toBe(0n)

      console.log('Random user total staked SUMR:', totalStaked.toString())
    })

    it('should match sum of individual bucket balances', async () => {
      const totalStaked = await sdk.armada.users.getUserStakingSumrStaked({ user })
      const balances = await sdk.armada.users.getUserStakingBalanceV2({ user })

      // Calculate sum manually
      let manualSum = 0n
      balances.forEach((balance) => {
        console.log(`Bucket ${balance.bucket}: ${balance.amount.toString()}`)
        manualSum += balance.amount
      })

      console.log('Total from getUserStakingSumrStaked:', totalStaked.toString())
      console.log('Manual sum of buckets:', manualSum.toString())

      expect(totalStaked).toBe(manualSum)
    })
  })
})
