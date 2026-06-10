import type { AddressValue } from '@summerfi/sdk-common'
import assert from 'assert'
import { BigNumber } from 'bignumber.js'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { RwaTestConfig } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 *
 * RWA — getVaultMarketValue (read; vault-wide TVL = Fleet assets + vault-wide pending deposits +
 * claimable withdrawals, in the Fleet input asset + USD + breakdown).
 *
 * Manual, scenario-parametrized test (not run in CI). Edit the scenarios below (fleet).
 */
describe('RWA - getVaultMarketValue', () => {
  const { sdk, chainId } = createInstiSdkTestSetup()

  const scenarios: {
    fleetAddressValue: AddressValue
  }[] = [
    {
      fleetAddressValue: RwaTestConfig.fleetAddressValue,
    },
  ]

  test.each(scenarios)(
    'reads market value for fleet $fleetAddressValue',
    async ({ fleetAddressValue }) => {
      const marketValue = await sdk.rwa.getVaultMarketValue({
        chainId,
        fleetAddress: fleetAddressValue,
      })

      console.log('[RWA getVaultMarketValue]', {
        total: marketValue.total.toString(),
        totalUsd: marketValue.totalUsd.toString(),
        fleetAssets: marketValue.fleetAssets.toString(),
        pendingDeposits: marketValue.pendingDeposits.toString(),
        claimableWithdrawals: marketValue.claimableWithdrawals.toString(),
      })

      // total must equal the sum of its components, and be >= the Fleet assets alone.
      const componentsSum = marketValue.fleetAssets
        .add(marketValue.pendingDeposits)
        .add(marketValue.claimableWithdrawals)
      assert(
        new BigNumber(marketValue.total.amount).eq(new BigNumber(componentsSum.amount)),
        `total ${marketValue.total.amount} should equal sum of components ${componentsSum.amount}`,
      )
      assert(
        new BigNumber(marketValue.total.amount).gte(new BigNumber(marketValue.fleetAssets.amount)),
        'total market value should be >= fleet assets',
      )
    },
  )
})
