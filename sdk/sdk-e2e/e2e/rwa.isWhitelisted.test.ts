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
 * RWA whitelist — isWhitelisted (read; account allowed for a Fleet context, explicitly or via open).
 */
describe('RWA - Whitelist - isWhitelisted', () => {
  const { sdk, chainId } = createInstiSdkTestSetup()
  const chainInfo = getChainInfoByChainId(chainId)

  const scenarios: {
    fleetAddressValue: AddressValue
    accountValue: AddressValue
    /** Optional expected value to assert against. */
    expected?: boolean
  }[] = [
    {
      fleetAddressValue: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
      accountValue: RwaTestConfig.userAddressValue,
    },
  ]

  test.each(scenarios)(
    'reads isWhitelisted for $accountValue on fleet $fleetAddressValue',
    async ({ fleetAddressValue, accountValue, expected }) => {
      const vaultId = ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({ value: fleetAddressValue }),
      })
      const account = Address.createFromEthereum({ value: accountValue })

      const isWhitelisted = await sdk.rwa.isWhitelisted({ vaultId, account })
      console.log(`[RWA isWhitelisted] ${accountValue}: ${isWhitelisted}`)
      assert(typeof isWhitelisted === 'boolean', 'isWhitelisted should return a boolean')

      if (expected !== undefined) {
        expect(isWhitelisted).toBe(expected)
      }
    },
  )
})
