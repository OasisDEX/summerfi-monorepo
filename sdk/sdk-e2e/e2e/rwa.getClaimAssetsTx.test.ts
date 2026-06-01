import { type AddressValue } from '@summerfi/sdk-common'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { RwaTestConfig } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 *
 * RWA — getClaimAssetsTx (build Output RoundsVault.redeemExchangeAsset; settled-round receipt →
 * underlying asset e.g. USDC).
 *
 * Manual, scenario-parametrized test (not run in CI). Point `roundId` at a SETTLED Output round and set
 * `amount` to the receipt units to redeem. Sent via the user signer (simulate-only by default).
 */
describe('RWA - getClaimAssetsTx', () => {
  const { sdk, chainId, userAddress, userSendTxTool } = createInstiSdkTestSetup()

  const scenarios: {
    fleetAddress: AddressValue
    roundId: bigint
    /** Receipt token amount to redeem (base units). */
    amount: bigint
    /** Optional alternative receiver of the underlying asset. */
    receiverAddress?: AddressValue
  }[] = [
    {
      fleetAddress: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
      roundId: 5n,
      amount: 1n,
    },
  ]

  test.each(scenarios)(
    'builds claim-assets tx for fleet $fleetAddress round $roundId',
    async ({ fleetAddress, roundId, amount, receiverAddress }) => {
      const tx = await sdk.rwa.getClaimAssetsTx({
        chainId,
        fleetAddress,
        userAddress: userAddress.value,
        roundId,
        amount,
        receiverAddress,
      })
      expect(tx).toBeDefined()
      console.log(`[RWA getClaimAssetsTx] tx: ${tx.description}`)

      const status = await userSendTxTool(tx)
      expect(status).toBe('success')
    },
  )
})
