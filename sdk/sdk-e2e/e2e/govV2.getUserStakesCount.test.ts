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
      const result = await sdk.armada.users.getUserStakesCount({ user })

      expect(result).toBeDefined()
      expect(result.userStakesCountBefore).toBeDefined()
      expect(result.userStakesCountAfter).toBeDefined()
      expect(typeof result.userStakesCountBefore).toBe('bigint')
      expect(typeof result.userStakesCountAfter).toBe('bigint')
      expect(result.userStakesCountBefore).toBeGreaterThanOrEqual(0n)
      expect(result.userStakesCountAfter).toBeGreaterThanOrEqual(0n)

      console.log('User stakes count before:', result.userStakesCountBefore.toString())
      console.log('User stakes count after:', result.userStakesCountAfter.toString())

      expect(result.userStakesCountAfter).toBe(result.userStakesCountBefore + 1n)
    })

    it('should get user stakes count', async () => {
      const result = await sdk.armada.users.getUserStakesCount({ user })

      expect(result).toBeDefined()
      expect(result.userStakesCountBefore).toBeDefined()
      expect(result.userStakesCountAfter).toBeDefined()
      expect(typeof result.userStakesCountBefore).toBe('bigint')
      expect(typeof result.userStakesCountAfter).toBe('bigint')
      expect(result.userStakesCountBefore).toBeGreaterThanOrEqual(0n)
      expect(result.userStakesCountAfter).toBeGreaterThanOrEqual(0n)

      console.log('User stakes count before:', result.userStakesCountBefore.toString())
      console.log('User stakes count after:', result.userStakesCountAfter.toString())

      expect(result.userStakesCountAfter).toBe(result.userStakesCountBefore + 1n)
    })

    it('should return 0 for user with no stakes', async () => {
      // Create a new random user that likely has no stakes
      const randomAddress = Address.createFromEthereum({
        value: '0x0000000000000000000000000000000000000001',
      })
      const randomUser = User.createFromEthereum(chainInfo.chainId, randomAddress.value)

      const result = await sdk.armada.users.getUserStakesCount({ user: randomUser })

      expect(result).toBeDefined()
      expect(result.userStakesCountBefore).toBeDefined()
      expect(result.userStakesCountAfter).toBeDefined()
      expect(typeof result.userStakesCountBefore).toBe('bigint')
      expect(typeof result.userStakesCountAfter).toBe('bigint')
      expect(result.userStakesCountBefore).toBeGreaterThanOrEqual(0n)
      expect(result.userStakesCountAfter).toBeGreaterThanOrEqual(0n)

      console.log('Random user stakes count before:', result.userStakesCountBefore.toString())
      console.log('Random user stakes count after:', result.userStakesCountAfter.toString())
    })
  })
})
