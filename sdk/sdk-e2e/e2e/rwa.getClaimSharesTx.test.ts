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
  const { sdk, chainId, userAddress, userSendTxTool } = createInstiSdkTestSetup()
  const chainInfo = getChainInfoByChainId(chainId)

  const scenarios: {
    fleetAddressValue: AddressValue
    roundId: bigint
    /** Receipt token amount to redeem (base units). */
    amount: bigint
    /** Optional alternative receiver of the Fleet shares. */
    receiverValue?: AddressValue
  }[] = [
    {
      fleetAddressValue: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
      roundId: 0n,
      amount: 1n,
    },
  ]

  test.each(scenarios)(
    'builds claim-shares tx for fleet $fleetAddressValue round $roundId',
    async ({ fleetAddressValue, roundId, amount, receiverValue }) => {
      const vaultId = ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({ value: fleetAddressValue }),
      })
      const user = User.createFromEthereum(chainId, userAddress.value)
      const receiver = receiverValue
        ? Address.createFromEthereum({ value: receiverValue })
        : undefined

      const tx = await sdk.rwa.getClaimSharesTx({ vaultId, user, roundId, amount, receiver })
      expect(tx).toBeDefined()
      console.log(`[RWA getClaimSharesTx] tx: ${tx.description}`)

      const status = await userSendTxTool(tx)
      expect(status).toBe('success')
    },
  )
})
