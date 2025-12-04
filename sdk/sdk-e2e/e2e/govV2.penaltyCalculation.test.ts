import { ChainIds, User, type AddressValue, type ChainId } from '@summerfi/sdk-common'

import { createTestSDK } from './utils/sdkInstance'
import { SharedConfig } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol Gov V2 Penalty Calculation', () => {
  const sdk = createTestSDK()

  const scenarios: { chainId: ChainId; userAddressValue: AddressValue }[] = [
    {
      chainId: ChainIds.Base,
      userAddressValue: SharedConfig.userAddressValue,
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    it('should calculate penalty percentages for multiple stakes', async () => {
      // First, get user stakes to test with actual stakes
      const user = User.createFromEthereum(scenario.chainId, scenario.userAddressValue)

      const stakes = await sdk.armada.users.getUserStakesV2({ user })

      // Skip test if user has no stakes
      if (stakes.length === 0) {
        console.log('User has no stakes, skipping test')
        return
      }

      // Test penalty percentage for all stakes (or first 3 if many)
      const testStakes = stakes.slice(0, Math.min(stakes.length, 3))
      const results = await sdk.armada.users.getCalculatePenaltyPercentage({
        userStakes: testStakes,
      })

      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBe(testStakes.length)

      results.forEach((result, index) => {
        expect(result).toBeDefined()
        expect(result.value).toBeGreaterThanOrEqual(0)
        // Penalty percentage should be reasonable (0-20%)
        expect(result.value).toBeLessThanOrEqual(20)

        console.log(
          `Penalty percentage for stake ${testStakes[index].index}:`,
          result.value.toFixed(2) + '%',
        )
      })
    })

    it('should calculate penalty amounts for multiple stakes', async () => {
      // First, get user stakes to test with actual stakes
      const user = User.createFromEthereum(scenario.chainId, scenario.userAddressValue)

      const stakes = await sdk.armada.users.getUserStakesV2({ user })

      // Skip test if user has no stakes
      if (stakes.length === 0) {
        console.log('User has no stakes, skipping test')
        return
      }

      const testStakes = stakes.slice(0, Math.min(stakes.length, 3))
      const amounts = testStakes.map((stake) => stake.amount / 2n) // Try to unstake half of each

      const results = await sdk.armada.users.getCalculatePenaltyAmount({
        userStakes: testStakes,
        amounts,
      })

      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBe(testStakes.length)

      results.forEach((result, index) => {
        expect(result).toBeDefined()
        expect(typeof result).toBe('bigint')
        expect(result).toBeGreaterThanOrEqual(0n)

        // Penalty should not exceed the unstake amount
        expect(result).toBeLessThanOrEqual(amounts[index])

        console.log(
          `Penalty amount for unstaking ${amounts[index].toString()} from stake ${testStakes[index].index}:`,
          result.toString(),
        )
      })
    })

    it('should calculate zero penalty for fully matured stakes', async () => {
      // Create mock expired stakes (lockupEndTime in the past)
      const expiredStakes = [
        {
          index: 0,
          amount: BigInt(1000),
          weightedAmount: BigInt(1000),
          lockupEndTime: BigInt(Math.floor(Date.now() / 1000) - 86400), // 1 day ago
          lockupPeriod: BigInt(0),
          multiplier: 1,
        },
        {
          index: 1,
          amount: BigInt(2000),
          weightedAmount: BigInt(2000),
          lockupEndTime: BigInt(Math.floor(Date.now() / 1000) - 172800), // 2 days ago
          lockupPeriod: BigInt(0),
          multiplier: 1,
        },
      ]

      const results = await sdk.armada.users.getCalculatePenaltyPercentage({
        userStakes: expiredStakes,
      })

      // For expired stakes, penalties should be 0
      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBe(expiredStakes.length)

      results.forEach((result, index) => {
        expect(result).toBeDefined()
        expect(result.value).toBe(0)
        console.log(`Penalty percentage for expired stake ${index}:`, result.value + '%')
      })
    })

    it('should calculate penalty amounts correctly with full stake amounts', async () => {
      // First, get user stakes to test with actual stakes
      const user = User.createFromEthereum(scenario.chainId, scenario.userAddressValue)

      const stakes = await sdk.armada.users.getUserStakesV2({ user })

      // Skip test if user has no stakes
      if (stakes.length === 0) {
        console.log('User has no stakes, skipping test')
        return
      }

      const testStakes = stakes.slice(0, Math.min(stakes.length, 3))
      const fullAmounts = testStakes.map((stake) => stake.amount)

      const results = await sdk.armada.users.getCalculatePenaltyAmount({
        userStakes: testStakes,
        amounts: fullAmounts,
      })

      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBe(testStakes.length)

      results.forEach((result, index) => {
        expect(result).toBeDefined()
        expect(typeof result).toBe('bigint')
        expect(result).toBeGreaterThanOrEqual(0n)
        expect(result).toBeLessThanOrEqual(fullAmounts[index])

        // Log the penalty ratio
        const penaltyRatio = Number(result) / Number(fullAmounts[index])
        console.log(
          `Penalty for stake ${testStakes[index].index}: ${result.toString()} (${(penaltyRatio * 100).toFixed(2)}% of ${fullAmounts[index].toString()})`,
        )
      })
    })
  })
})
