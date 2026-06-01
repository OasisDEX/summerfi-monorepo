import {
  Address,
  ArmadaVaultId,
  User,
  getChainInfoByChainId,
  type AddressValue,
} from '@summerfi/sdk-common'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { RwaTestConfig } from './utils/testConfig'

jest.setTimeout(300000)
const simulateOnly = true // Set to true to only simulate the transactions without sending them (for testing purposes).

/**
 * @group e2e
 *
 * RWA — getWithdrawTx (build approve + Output RoundsVault.deposit; Fleet shares → current-round
 * receipt).
 *
 * Manual, scenario-parametrized test (not run in CI). The deposited token here is the Fleet share
 * token (the Output vault's underlying) — set `tokenSymbol` to the share token symbol for the target
 * Fleet. Returns TransactionInfo[] (optional approval + deposit); each is sent via the user signer
 * (simulate-only by default).
 */
describe('RWA - getWithdrawTx', () => {
  const { sdk, chainId, userAddress, userSendTxTool } = createInstiSdkTestSetup({ simulateOnly })
  const chainInfo = getChainInfoByChainId(chainId)

  const scenarios: {
    fleetAddressValue: AddressValue
    /** Human-readable amount (share token units). */
    amountValue: string
  }[] = [
    {
      fleetAddressValue: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
      amountValue: '1',
    },
  ]

  test.each(scenarios)(
    'builds withdraw tx of $amountValue from fleet $fleetAddressValue',
    async ({ fleetAddressValue, amountValue }) => {
      const vaultId = ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({ value: fleetAddressValue }),
      })
      const user = User.createFromEthereum(chainId, userAddress.value)

      const txs = await sdk.rwa.getWithdrawTx({ vaultId, user, sharesAmount: amountValue })
      expect(Array.isArray(txs)).toBe(true)
      expect(txs.length).toBeGreaterThan(0)
      console.log(
        `[RWA getWithdrawTx] ${txs.length} tx(s): ${txs.map((t) => t.description).join(' | ')}`,
      )

      for (const tx of txs) {
        const status = await userSendTxTool(tx)
        expect(status).toBe('success')
      }
    },
  )
})
