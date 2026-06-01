import {
  Address,
  ArmadaVaultId,
  getChainInfoByChainId,
  type AddressValue,
} from '@summerfi/sdk-common'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { RwaTestConfig } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 *
 * RWA whitelist — setWhitelistedBatch (many accounts in one tx, per-Fleet context).
 *
 * Each scenario supplies parallel `accountValues` / `allowed` arrays (must be equal length, and at
 * most MAX_WHITELIST_BATCH_SIZE = 200 on-chain). Sends the batch tx (simulate-only by default) and
 * re-reads each account's status afterwards.
 */
describe('RWA - Whitelist - setWhitelistedBatch', () => {
  const { sdk, chainId, governorSendTxTool } = createInstiSdkTestSetup()
  const chainInfo = getChainInfoByChainId(chainId)

  const scenarios: {
    fleetAddressValue: AddressValue
    accountValues: AddressValue[]
    allowed: boolean[]
  }[] = [
    {
      fleetAddressValue: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
      accountValues: [RwaTestConfig.userAddressValue],
      allowed: [true],
    },
  ]

  test.each(scenarios)(
    'batch-sets whitelist status on fleet $fleetAddressValue',
    async ({ fleetAddressValue, accountValues, allowed }) => {
      expect(accountValues.length).toBe(allowed.length)

      const vaultId = ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({ value: fleetAddressValue }),
      })
      const accounts = accountValues.map((value) => Address.createFromEthereum({ value }))

      const txInfo = await sdk.rwa.getSetWhitelistedBatchTx({ vaultId, accounts, allowed })
      expect(txInfo).toBeDefined()
      console.log(`[RWA whitelist batch] tx: ${txInfo.description}`)

      const status = await governorSendTxTool(txInfo)
      expect(status).toBe('success')

      for (const account of accounts) {
        const after = await sdk.rwa.isWhitelisted({ vaultId, account })
        console.log(`[RWA whitelist batch] ${account.value} after: ${after}`)
      }
    },
  )
})
