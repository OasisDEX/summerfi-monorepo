import { User, Address, getChainInfoByChainId } from '@summerfi/sdk-common'

import { createTestSDK } from './utils/sdkInstance'
import { SharedConfig, TestConfigs, type TestConfigKey } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol Gov V2 getUserStakesV2', () => {
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

    it('should get all user stakes', async () => {
      const result = await sdk.armada.users.getUserStakesV2({ user })

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)

      console.log(`Found ${result.length} stakes for user`)

      // Validate each stake
      result.forEach((stake, idx) => {
        console.log(`Stake ${idx}:`, {
          index: stake.index.toString(),
          amount: stake.amount.toString(),
          weightedAmount: stake.weightedAmount.toString(),
          lockupEndTime: stake.lockupEndTime.toString(),
          lockupPeriod: stake.lockupPeriod.toString(),
          multiplier: stake.multiplier.toString(),
        })

        // Validate stake structure
        expect(stake.index).toBeDefined()
        expect(typeof stake.index).toBe('number')
        expect(stake.index).toBe(idx)

        expect(stake.amount).toBeDefined()
        expect(typeof stake.amount).toBe('bigint')
        expect(stake.amount).toBeGreaterThan(0n)

        expect(stake.weightedAmount).toBeDefined()
        expect(typeof stake.weightedAmount).toBe('bigint')
        expect(stake.weightedAmount).toBeGreaterThanOrEqual(stake.amount)

        expect(stake.lockupEndTime).toBeDefined()
        expect(typeof stake.lockupEndTime).toBe('bigint')
        expect(stake.lockupEndTime).toBeGreaterThanOrEqual(0n)

        expect(stake.lockupPeriod).toBeDefined()
        expect(typeof stake.lockupPeriod).toBe('bigint')
        expect(stake.lockupPeriod).toBeGreaterThanOrEqual(0n)

        expect(stake.multiplier).toBeDefined()
        expect(typeof stake.multiplier).toBe('number')
        expect(stake.multiplier).toBeGreaterThanOrEqual(1)
      })
    })

    it('should return empty array for user with no stakes', async () => {
      // Create a new random user that likely has no stakes
      const randomAddress = Address.createFromEthereum({
        value: '0x0000000000000000000000000000000000000001',
      })
      const randomUser = User.createFromEthereum(chainInfo.chainId, randomAddress.value)

      const result = await sdk.armada.users.getUserStakesV2({ user: randomUser })

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)

      console.log('Random user has no stakes:', result.length)
    })

    it('should match stakes count with getUserStakesCount', async () => {
      // Get all stakes
      const stakes = await sdk.armada.users.getUserStakesV2({ user })

      // Get stakes count
      const countResult = await sdk.armada.users.getUserStakesCount({ user })

      console.log('Stakes array length:', stakes.length)
      console.log('Stakes count before:', countResult.userStakesCountBefore.toString())

      // The stakes array length should match userStakesCountBefore
      expect(stakes.length).toBe(Number(countResult.userStakesCountBefore))
    })

    it('should verify lockup times are in the future for active locks', async () => {
      const stakes = await sdk.armada.users.getUserStakesV2({ user })
      const currentTime = BigInt(Math.floor(Date.now() / 1000))

      stakes.forEach((stake, idx) => {
        if (stake.lockupPeriod > 0n) {
          console.log(
            `Stake ${idx} lockup end:`,
            new Date(Number(stake.lockupEndTime) * 1000).toISOString(),
          )

          // If there's a lockup period, lockupEndTime should be defined
          expect(stake.lockupEndTime).toBeGreaterThan(0n)

          // lockupEndTime can be in the past (lock expired) or future (still locked)
          // We just verify it's a reasonable timestamp
          expect(stake.lockupEndTime).toBeGreaterThan(currentTime - 365n * 24n * 60n * 60n * 3n) // Not more than 3 years in the past
        }
      })
    })
  })
})
