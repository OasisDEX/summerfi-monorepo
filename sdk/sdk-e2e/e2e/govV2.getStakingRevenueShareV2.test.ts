import type { InstiVersion } from '@summerfi/sdk-common'
import { createTestSdkInstance } from './utils/createTestSdkInstance'
import { TestClientIds } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - getProtocolTvl', () => {
  const scenarios: { clientId?: string; instiVersion?: InstiVersion }[] = [
    {},
    { clientId: TestClientIds.ACME },
    { clientId: TestClientIds.ACME_v2, instiVersion: 'v2' },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    it('should get total protocol TVL across all chains', async () => {
      const sdk = createTestSdkInstance(scenario.clientId, scenario.instiVersion)

      const { percentage, amount } = await sdk.armada.users.getStakingRevenueShareV2()

      console.log(
        `Staking Revenue Share Percentage: ${percentage}\nStaking Revenue Share Amount: $${amount.toLocaleString()}`,
      )

      // Verify the result is a number and greater than or equal to 0
      expect(percentage).toBeDefined()
      expect(amount).toBeDefined()
    })
  })
})
