import type { AddressValue } from '@summerfi/sdk-common'
import assert from 'assert'
import { BigNumber } from 'bignumber.js'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { RwaTestConfig } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 *
 * RWA — getUserVaultExposure (read; a user's total exposure = settled position + pending deposits +
 * claimable deposits + pending withdrawals, in the Fleet input asset + USD + breakdown).
 *
 * Manual, scenario-parametrized test (not run in CI). Edit the scenarios below (fleet, user).
 */
describe('RWA - getUserVaultExposure', () => {
  const { sdk, chainId } = createInstiSdkTestSetup()

  const scenarios: {
    fleetAddressValue: AddressValue
    userAddressValue: AddressValue
  }[] = [
    {
      fleetAddressValue: RwaTestConfig.fleetAddressValue,
      userAddressValue: RwaTestConfig.userAddressValue,
    },
  ]

  test.each(scenarios)(
    'reads exposure for $userAddressValue on fleet $fleetAddressValue',
    async ({ fleetAddressValue, userAddressValue }) => {
      const exposure = await sdk.rwa.getUserVaultExposure({
        chainId,
        fleetAddress: fleetAddressValue,
        userAddress: userAddressValue,
      })

      console.log('[RWA getUserVaultExposure]', {
        total: exposure.total.toString(),
        totalUsd: exposure.totalUsd.toString(),
        settledPosition: exposure.settledPosition.toString(),
        pendingDeposits: exposure.pendingDeposits.toString(),
        claimableDeposits: exposure.claimableDeposits.toString(),
        pendingWithdrawals: exposure.pendingWithdrawals.toString(),
      })

      // total must equal the sum of its components (denominated in the input asset).
      const componentsSum = exposure.settledPosition
        .add(exposure.pendingDeposits)
        .add(exposure.claimableDeposits)
        .add(exposure.pendingWithdrawals)
      assert(
        new BigNumber(exposure.total.amount).eq(new BigNumber(componentsSum.amount)),
        `total ${exposure.total.amount} should equal sum of components ${componentsSum.amount}`,
      )
      assert(new BigNumber(exposure.total.amount).gte(0), 'total should be non-negative')
    },
  )
})
