import { RoundsVaultType, type AddressValue } from '@summerfi/sdk-common'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { RwaTestConfig } from './utils/testConfig'

jest.setTimeout(300000)
const simulateOnly = false // Set to true to only simulate the transactions without sending them (for testing purposes).
/**
 * @group e2e
 *
 * RWA — getCancelRoundDepositTx (build RoundsVault.redeem; cancel an open current-round receipt back
 * into the originally deposited asset).
 *
 * Manual, scenario-parametrized test (not run in CI). `roundId` must be the current OPEN round; pick
 * `vaultType` (Input cancels a USDC deposit, Output cancels a share deposit). Sent via the user signer
 * (simulate-only by default).
 */
describe('RWA - getCancelRoundDepositTx', () => {
  const { sdk, chainId, userAddress, userSendTxTool } = createInstiSdkTestSetup({ simulateOnly })

  const scenarios: {
    fleetAddressValue: AddressValue
    roundId: bigint
    /** Receipt token amount to redeem (base units). */
    amount: string
    vaultType: RoundsVaultType
    /** Optional alternative receiver of the returned asset. */
    receiverAddress?: AddressValue
  }[] = [
    {
      fleetAddressValue: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
      roundId: 5n,
      amount: '1',
      vaultType: RoundsVaultType.Input,
    },
  ]

  test.each(scenarios)(
    'builds cancel-round-deposit tx for fleet $fleetAddressValue round $roundId ($vaultType)',
    async ({ fleetAddressValue, roundId, amount, vaultType, receiverAddress }) => {
      const tx = await sdk.rwa.getCancelRoundDepositTx({
        chainId,
        fleetAddress: fleetAddressValue,
        userAddress: userAddress.value,
        roundId,
        amount,
        vaultType,
        receiverAddress,
      })
      expect(tx).toBeDefined()
      console.log(`[RWA getCancelRoundDepositTx] tx: ${tx.description}`)

      const status = await userSendTxTool(tx)
      expect(status).toBe('success')
    },
  )
})
