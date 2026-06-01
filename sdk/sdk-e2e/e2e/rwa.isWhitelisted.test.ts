import { type AddressValue } from '@summerfi/sdk-common'
import assert from 'assert'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { RwaTestConfig } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 *
 * RWA whitelist — isWhitelisted (read; account allowed for a Fleet context, explicitly or via open).
 */
describe('RWA - Whitelist - isWhitelisted', () => {
  const { sdk, chainId } = createInstiSdkTestSetup()

  const scenarios: {
    fleetAddress: AddressValue
    accountAddress: AddressValue
    /** Optional expected value to assert against. */
    expected?: boolean
  }[] = [
    {
      fleetAddress: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
      accountAddress: RwaTestConfig.userAddressValue,
    },
  ]

  test.each(scenarios)(
    'reads isWhitelisted for $accountAddress on fleet $fleetAddress',
    async ({ fleetAddress, accountAddress, expected }) => {
      const isWhitelisted = await sdk.rwa.isWhitelisted({ chainId, fleetAddress, accountAddress })
      console.log(`[RWA isWhitelisted] ${accountAddress}: ${isWhitelisted}`)
      assert(typeof isWhitelisted === 'boolean', 'isWhitelisted should return a boolean')

      if (expected !== undefined) {
        expect(isWhitelisted).toBe(expected)
      }
    },
  )
})
