import {
  Address,
  ArmadaVaultId,
  RoundsVaultType,
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
 * RWA — getCancelRoundDepositTx (build RoundsVault.redeem; cancel an open current-round receipt back
 * into the originally deposited asset).
 *
 * Manual, scenario-parametrized test (not run in CI). `roundId` must be the current OPEN round; pick
 * `vaultType` (Input cancels a USDC deposit, Output cancels a share deposit). Sent via the user signer
 * (simulate-only by default).
 */
describe('RWA - getCancelRoundDepositTx', () => {
  const { sdk, chainId, userAddress, userSendTxTool } = createInstiSdkTestSetup()
  const chainInfo = getChainInfoByChainId(chainId)

  const scenarios: {
    fleetAddressValue: AddressValue
    roundId: bigint
    /** Receipt token amount to redeem (base units). */
    amount: bigint
    vaultType: RoundsVaultType
    /** Optional alternative receiver of the returned asset. */
    receiverValue?: AddressValue
  }[] = [
    {
      fleetAddressValue: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
      roundId: 0n,
      amount: 1n,
      vaultType: RoundsVaultType.Input,
    },
  ]

  test.each(scenarios)(
    'builds cancel-round-deposit tx for fleet $fleetAddressValue round $roundId ($vaultType)',
    async ({ fleetAddressValue, roundId, amount, vaultType, receiverValue }) => {
      const vaultId = ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({ value: fleetAddressValue }),
      })
      const user = User.createFromEthereum(chainId, userAddress.value)
      const receiver = receiverValue
        ? Address.createFromEthereum({ value: receiverValue })
        : undefined

      const tx = await sdk.rwa.getCancelRoundDepositTx({
        vaultId,
        user,
        roundId,
        amount,
        vaultType,
        receiver,
      })
      expect(tx).toBeDefined()
      console.log(`[RWA getCancelRoundDepositTx] tx: ${tx.description}`)

      const status = await userSendTxTool(tx)
      expect(status).toBe('success')
    },
  )
})
