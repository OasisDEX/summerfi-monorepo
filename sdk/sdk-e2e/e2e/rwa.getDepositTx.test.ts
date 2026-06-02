import { type AddressValue } from '@summerfi/sdk-common'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { RwaTestConfig } from './utils/testConfig'

jest.setTimeout(300000)
const simulateOnly = true // Set to true to only simulate the transactions without sending them (for testing purposes).

/**
 * @group e2e
 *
 * RWA — getDepositTx (build approve + Input RoundsVault.deposit; USDC → current-round receipt).
 *
 * Manual, scenario-parametrized test (not run in CI). Edit the scenarios below (fleet, deposit token
 * symbol, human amount). Returns TransactionInfo[] (optional approval + deposit); each is sent via the
 * user signer (simulate-only by default).
 */
describe('RWA - getDepositTx', () => {
  const { sdk, chainId, userAddress, userSendTxTool } = createInstiSdkTestSetup({ simulateOnly })

  const scenarios: {
    fleetAddressValue: AddressValue
    /** Human-readable amount (token units). */
    amountValue: string
  }[] = [
    {
      fleetAddressValue: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
      amountValue: '1',
    },
  ]

  test.each(scenarios)(
    'builds deposit tx of $amountValue into fleet $fleetAddressValue',
    async ({ fleetAddressValue, amountValue }) => {
      const txs = await sdk.rwa.getDepositTx({
        chainId,
        fleetAddress: fleetAddressValue,
        userAddress: userAddress.value,
        assetsAmount: amountValue,
      })
      expect(Array.isArray(txs)).toBe(true)
      expect(txs.length).toBeGreaterThan(0)
      console.log(
        `[RWA getDepositTx] ${txs.length} tx(s): ${txs.map((t) => t.description).join(' | ')}`,
      )

      for (const tx of txs) {
        const status = await userSendTxTool(tx)
        expect(status).toBe('success')
      }
    },
  )
})
