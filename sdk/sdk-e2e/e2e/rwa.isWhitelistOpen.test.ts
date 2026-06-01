import { type AddressValue } from '@summerfi/sdk-common'
import assert from 'assert'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { RwaTestConfig } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 *
 * RWA whitelist — isWhitelistOpen (read; whether a Fleet context's whitelist is globally open).
 */
describe('RWA - Whitelist - isWhitelistOpen', () => {
  const { sdk, chainId } = createInstiSdkTestSetup()

  const scenarios: {
    fleetAddress: AddressValue
    /** Optional expected value to assert against. */
    expected?: boolean
  }[] = [
    {
      fleetAddress: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
    },
  ]

  test.each(scenarios)(
    'reads isWhitelistOpen for fleet $fleetAddress',
    async ({ fleetAddress, expected }) => {
      const isOpen = await sdk.rwa.isWhitelistOpen({ chainId, fleetAddress })
      console.log(`[RWA isWhitelistOpen] fleet ${fleetAddress}: ${isOpen}`)
      assert(typeof isOpen === 'boolean', 'isWhitelistOpen should return a boolean')

      if (expected !== undefined) {
        expect(isOpen).toBe(expected)
      }
    },
  )
})
