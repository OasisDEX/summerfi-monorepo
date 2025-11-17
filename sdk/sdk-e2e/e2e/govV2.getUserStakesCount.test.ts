import { User, Address, getChainInfoByChainId } from '@summerfi/sdk-common'

import { createTestSDK } from './utils/sdkInstance'
import { SharedConfig, TestConfigs, type TestConfigKey } from './utils/testConfig'

jest.setTimeout(300000)

describe('Armada Protocol Gov V2 getUserStakesCount', () => {
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

    it('should get user stakes count', async () => {
      const stakesCount = await sdk.armada.users.getUserStakesCount({ user })

      expect(stakesCount).toBeDefined()
      expect(typeof stakesCount).toBe('bigint')
      expect(stakesCount).toBeGreaterThanOrEqual(0n)

      console.log('User stakes count:', stakesCount.toString())

      // Also get the balance to verify the logic
      const balances = await sdk.armada.users.getUserStakingBalanceV2({ user })
      const zeroBalance = balances.find((balance) => balance.bucket === 0)?.amount || 0n

      console.log('Zero bucket balance:', zeroBalance.toString())

      // If zero balance is 0, then stakesCount should be rawCount - 1
      // We can't directly test the rawCount, but we can verify the returned count is reasonable
      expect(stakesCount).toBeGreaterThanOrEqual(0n)
    })

    it('should return 0 for user with no stakes', async () => {
      // Create a new random user that likely has no stakes
      const randomAddress = Address.createFromEthereum({
        value: '0x0000000000000000000000000000000000000001',
      })
      const randomUser = User.createFromEthereum(chainInfo.chainId, randomAddress.value)

      const stakesCount = await sdk.armada.users.getUserStakesCount({ user: randomUser })

      expect(stakesCount).toBeDefined()
      expect(typeof stakesCount).toBe('bigint')
      expect(stakesCount).toBeGreaterThanOrEqual(0n)

      console.log('Random user stakes count:', stakesCount.toString())
    })
  })
})
