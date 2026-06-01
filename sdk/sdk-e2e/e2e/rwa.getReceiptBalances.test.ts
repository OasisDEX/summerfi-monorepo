import { RoundsVaultType, type AddressValue } from '@summerfi/sdk-common'
import assert from 'assert'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { RwaTestConfig } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 *
 * RWA — getReceiptBalances (read; per-round ERC-1155 receipt balances held by an account in a Fleet's
 * RoundsVault, sourced from the RWA subgraph).
 *
 * Manual, scenario-parametrized test (not run in CI). Edit the scenarios below (fleet, account, side).
 */
describe('RWA - getReceiptBalances', () => {
  const { sdk, chainId } = createInstiSdkTestSetup()

  const scenarios: {
    fleetAddressValue: AddressValue
    accountValue: AddressValue
    vaultType: RoundsVaultType
  }[] = [
    {
      fleetAddressValue: RwaTestConfig.fleetAddressValue,
      accountValue: RwaTestConfig.userAddressValue,
      vaultType: RoundsVaultType.Input,
    },
    {
      fleetAddressValue: RwaTestConfig.fleetAddressValue,
      accountValue: RwaTestConfig.userAddressValue,
      vaultType: RoundsVaultType.Output,
    },
  ]

  test.each(scenarios)(
    'reads receipt balances for $accountValue on fleet $fleetAddressValue ($vaultType)',
    async ({ fleetAddressValue, accountValue, vaultType }) => {
      const balances = await sdk.rwa.getReceiptBalances({
        chainId,
        fleetAddress: fleetAddressValue,
        accountAddress: accountValue,
        vaultType,
      })

      console.log(
        `[RWA getReceiptBalances] ${vaultType} ${accountValue}:`,
        balances.map((b) => ({ roundId: b.roundId.toString(), balance: b.balance.toString() })),
      )

      assert(Array.isArray(balances), 'getReceiptBalances should return an array')
      for (const b of balances) {
        assert(typeof b.roundId === 'bigint', 'roundId should be a bigint')
        assert(typeof b.balance === 'bigint', 'balance should be a bigint')
      }
    },
  )
})
