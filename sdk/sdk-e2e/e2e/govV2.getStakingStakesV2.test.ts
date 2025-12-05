import { createTestSDK } from './utils/sdkInstance'
import { type TestConfigKey } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol Gov V2 getStakingStakesV2', () => {
  const sdk = createTestSDK()

  const scenarios: { testConfigKey: TestConfigKey }[] = [
    {
      testConfigKey: 'BaseUSDC',
    },
  ]

  describe.each(scenarios)('with scenario %#', () => {
    it('should get staking stakes with pagination', async () => {
      const first = 10
      const skip = 0

      const result = await sdk.armada.users.getStakingStakesV2({ first, skip })

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeLessThanOrEqual(first)

      console.log(`Found ${result.length} stakes`)

      // Validate each stake
      result.forEach((stake, idx) => {
        console.log(`Stake ${idx}:`, {
          owner: stake.owner,
          index: stake.index.toString(),
          amount: stake.amount.toString(),
          weightedAmount: stake.weightedAmount.toString(),
          weightedAmountNormalized: stake.weightedAmountNormalized,
          lockupStartTime: stake.lockupStartTime.toString(),
          lockupEndTime: stake.lockupEndTime.toString(),
          lockupPeriod: stake.lockupPeriod.toString(),
          multiplier: stake.multiplier,
        })

        // Validate stake structure
        expect(stake.owner).toBeDefined()
        expect(typeof stake.owner).toBe('string')
        expect(stake.owner).toMatch(/^0x[a-fA-F0-9]{40}$/)

        expect(stake.index).toBeDefined()
        expect(typeof stake.index).toBe('number')
        expect(stake.index).toBeGreaterThanOrEqual(0)

        expect(stake.amount).toBeDefined()
        expect(typeof stake.amount).toBe('bigint')
        expect(stake.amount).toBeGreaterThan(0n)

        expect(stake.weightedAmount).toBeDefined()
        expect(typeof stake.weightedAmount).toBe('bigint')
        expect(stake.weightedAmount).toBeGreaterThanOrEqual(stake.amount)

        expect(stake.weightedAmountNormalized).toBeDefined()
        expect(typeof stake.weightedAmountNormalized).toBe('number')
        expect(stake.weightedAmountNormalized).toBeGreaterThanOrEqual(0)

        expect(stake.lockupStartTime).toBeDefined()
        expect(typeof stake.lockupStartTime).toBe('bigint')
        expect(stake.lockupStartTime).toBeGreaterThan(0n)

        expect(stake.lockupEndTime).toBeDefined()
        expect(typeof stake.lockupEndTime).toBe('bigint')
        expect(stake.lockupEndTime).toBeGreaterThanOrEqual(stake.lockupStartTime)

        expect(stake.lockupPeriod).toBeDefined()
        expect(typeof stake.lockupPeriod).toBe('bigint')
        expect(stake.lockupPeriod).toBeGreaterThanOrEqual(0n)

        expect(stake.multiplier).toBeDefined()
        expect(typeof stake.multiplier).toBe('number')
        expect(stake.multiplier).toBeGreaterThanOrEqual(1)
      })
    })

    it('should support pagination with skip', async () => {
      const first = 5
      const skip = 0

      const firstPage = await sdk.armada.users.getStakingStakesV2({ first, skip })
      const secondPage = await sdk.armada.users.getStakingStakesV2({ first, skip: first })

      expect(firstPage).toBeDefined()
      expect(secondPage).toBeDefined()
      expect(Array.isArray(firstPage)).toBe(true)
      expect(Array.isArray(secondPage)).toBe(true)

      console.log(`First page: ${firstPage.length} stakes`)
      console.log(`Second page: ${secondPage.length} stakes`)

      // If there are enough stakes, pages should be different
      if (firstPage.length === first && secondPage.length > 0) {
        // First stake in second page should be different from first page
        const firstPageOwners = firstPage.map((s) => s.owner)
        const secondPageOwners = secondPage.map((s) => s.owner)

        // They should not be identical
        expect(JSON.stringify(firstPageOwners)).not.toBe(JSON.stringify(secondPageOwners))
      }
    })

    it('should validate multiplier calculation', async () => {
      const first = 10
      const skip = 0

      const result = await sdk.armada.users.getStakingStakesV2({ first, skip })

      result.forEach((stake, idx) => {
        // Multiplier should be weightedAmountNormalized / amount
        const calculatedMultiplier =
          stake.weightedAmountNormalized / parseFloat(stake.amount.toString())

        console.log(
          `Stake ${idx} multiplier check: ${stake.multiplier} vs calculated: ${calculatedMultiplier}`,
        )

        // Allow for small floating point differences
        expect(Math.abs(stake.multiplier - calculatedMultiplier)).toBeLessThan(0.0001)
      })
    })
  })
})
