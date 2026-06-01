import {
  Address,
  ArmadaVaultId,
  getChainInfoByChainId,
  type AddressValue,
} from '@summerfi/sdk-common'
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
  const chainInfo = getChainInfoByChainId(chainId)

  const scenarios: {
    fleetAddressValue: AddressValue
    /** Optional expected value to assert against. */
    expected?: boolean
  }[] = [
    {
      fleetAddressValue: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
    },
  ]

  test.each(scenarios)(
    'reads isWhitelistOpen for fleet $fleetAddressValue',
    async ({ fleetAddressValue, expected }) => {
      const vaultId = ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({ value: fleetAddressValue }),
      })

      const isOpen = await sdk.rwa.isWhitelistOpen({ vaultId })
      console.log(`[RWA isWhitelistOpen] fleet ${fleetAddressValue}: ${isOpen}`)
      assert(typeof isOpen === 'boolean', 'isWhitelistOpen should return a boolean')

      if (expected !== undefined) {
        expect(isOpen).toBe(expected)
      }
    },
  )
})
