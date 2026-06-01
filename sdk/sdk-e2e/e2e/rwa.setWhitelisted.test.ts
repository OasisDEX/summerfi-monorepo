import { type AddressValue } from '@summerfi/sdk-common'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { RwaTestConfig } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 *
 * RWA whitelist — setWhitelisted (single account, per-Fleet context on ProtocolAccessManagerV2).
 *
 * Configure the scenarios below to set/unset a single account on a given Fleet. Each scenario reads
 * the current status, sends the setWhitelisted tx (simulate-only by default), then re-reads to verify.
 * The signer (TEST_USER_PRIVATE_KEY) must hold WHITELIST_MANAGER_ROLE for a non-simulated run.
 */
describe('RWA - Whitelist - setWhitelisted', () => {
  const { sdk, chainId, governorSendTxTool } = createInstiSdkTestSetup()

  const scenarios: {
    /** Fleet address acting as the whitelist context. */
    fleetAddress: AddressValue
    /** Account to whitelist / de-list. */
    accountAddress: AddressValue
    /** true to whitelist, false to revoke. */
    allowed: boolean
  }[] = [
    {
      fleetAddress: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
      accountAddress: RwaTestConfig.userAddressValue,
      allowed: true,
    },
  ]

  test.each(scenarios)(
    'sets whitelist status of $accountAddress to $allowed on fleet $fleetAddress',
    async ({ fleetAddress, accountAddress, allowed }) => {
      const before = await sdk.rwa.isWhitelisted({ chainId, fleetAddress, accountAddress })
      console.log(`[RWA whitelist] ${accountAddress} before: ${before}`)

      const txInfo = await sdk.rwa.getSetWhitelistedTx({
        chainId,
        fleetAddress,
        accountAddress,
        allowed,
      })
      expect(txInfo).toBeDefined()
      console.log(`[RWA whitelist] tx: ${txInfo.description}`)

      const status = await governorSendTxTool(txInfo)
      expect(status).toBe('success')

      const after = await sdk.rwa.isWhitelisted({ chainId, fleetAddress, accountAddress })
      console.log(`[RWA whitelist] ${accountAddress} after: ${after}`)
    },
  )
})
