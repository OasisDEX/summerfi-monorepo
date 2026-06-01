import { type AddressValue } from '@summerfi/sdk-common'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { RwaTestConfig } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 *
 * RWA whitelist — setWhitelistedBatch (many accounts in one tx, per-Fleet context).
 *
 * Each scenario supplies parallel `accountAddresses` / `allowed` arrays (must be equal length, and at
 * most MAX_WHITELIST_BATCH_SIZE = 200 on-chain). Sends the batch tx (simulate-only by default) and
 * re-reads each account's status afterwards.
 */
describe('RWA - Whitelist - setWhitelistedBatch', () => {
  const { sdk, chainId, governorSendTxTool } = createInstiSdkTestSetup()

  const scenarios: {
    fleetAddress: AddressValue
    accountAddresses: AddressValue[]
    allowed: boolean[]
  }[] = [
    {
      fleetAddress: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
      accountAddresses: [RwaTestConfig.userAddressValue],
      allowed: [true],
    },
  ]

  test.each(scenarios)(
    'batch-sets whitelist status on fleet $fleetAddress',
    async ({ fleetAddress, accountAddresses, allowed }) => {
      expect(accountAddresses.length).toBe(allowed.length)

      const txInfo = await sdk.rwa.getSetWhitelistedBatchTx({
        chainId,
        fleetAddress,
        accountAddresses,
        allowed,
      })
      expect(txInfo).toBeDefined()
      console.log(`[RWA whitelist batch] tx: ${txInfo.description}`)

      const status = await governorSendTxTool(txInfo)
      expect(status).toBe('success')

      for (const accountAddress of accountAddresses) {
        const after = await sdk.rwa.isWhitelisted({ chainId, fleetAddress, accountAddress })
        console.log(`[RWA whitelist batch] ${accountAddress} after: ${after}`)
      }
    },
  )
})
