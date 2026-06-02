import { RoundsVaultType, type AddressValue } from '@summerfi/sdk-common'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { retryUntilDefined } from './utils/retryUntilDefined'
import { RwaTestConfig } from './utils/testConfig'

type ReceiptBalances = { roundId: bigint; balance: bigint }[]

const serializeBalances = (balances: ReceiptBalances) =>
  JSON.stringify(
    balances.map((b) => ({ roundId: b.roundId.toString(), balance: b.balance.toString() })),
  )

const logReceiptBalances = (label: string, balances: ReceiptBalances) =>
  console.log(`[RWA getClaimSharesTx] receipt balances ${label}:`, serializeBalances(balances))

jest.setTimeout(300000)
const simulateOnly = false

/**
 * @group e2e
 *
 * RWA — getClaimSharesTx (build Input RoundsVault.redeemExchangeAsset; settled-round receipt → Fleet
 * shares).
 *
 * Manual, scenario-parametrized test (not run in CI). Point `roundId` at a SETTLED Input round and set
 * `amount` to the receipt units to redeem. Sent via the user signer (simulate-only by default).
 */
describe('RWA - getClaimSharesTx', () => {
  const { sdk, chainId, userAddress, userSendTxTool } = createInstiSdkTestSetup({ simulateOnly })

  const scenarios: {
    fleetAddress: AddressValue
    roundId: bigint
    /** Human-readable receipt amount to redeem (e.g. "1"); converted via the vault's underlying decimals. */
    amount: string
    /** Optional alternative receiver of the Fleet shares. */
    receiverAddress?: AddressValue
  }[] = [
    {
      fleetAddress: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
      roundId: 5n,
      amount: '1',
    },
  ]

  test.each(scenarios)(
    'builds claim-shares tx for fleet $fleetAddress round $roundId',
    async ({ fleetAddress, roundId, amount, receiverAddress }) => {
      // Input-vault receipts held by the user are burned as the settled receipt is exchanged for shares.
      const before = await sdk.rwa.getReceiptBalances({
        chainId,
        fleetAddress,
        accountAddress: userAddress.value,
        vaultType: RoundsVaultType.Input,
      })
      logReceiptBalances('before', before)

      const tx = await sdk.rwa.getClaimSharesTx({
        chainId,
        fleetAddress,
        userAddress: userAddress.value,
        roundId,
        amount,
        receiverAddress,
      })
      expect(tx).toBeDefined()
      console.log(`[RWA getClaimSharesTx] tx: ${tx.description}`)

      const status = await userSendTxTool(tx)
      expect(status).toBe('success')

      // Only re-read after a real (non-simulated) send — a simulate-only run does not mutate state.
      // Retry to allow the subgraph to index the burn (balances must differ from `before`).
      if (!simulateOnly) {
        const beforeKey = serializeBalances(before)
        const after = await retryUntilDefined(
          () =>
            sdk.rwa.getReceiptBalances({
              chainId,
              fleetAddress,
              accountAddress: userAddress.value,
              vaultType: RoundsVaultType.Input,
            }),
          (value) => value !== undefined && serializeBalances(value) !== beforeKey,
        )
        expect(after).toBeDefined()
        logReceiptBalances('after', after as ReceiptBalances)
      }
    },
  )
})
