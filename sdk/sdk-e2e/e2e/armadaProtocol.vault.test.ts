/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Address,
  ArmadaVaultId,
  getChainInfoByChainId,
  type IArmadaVaultInfo,
} from '@summerfi/sdk-common'

import assert from 'assert'
import { stringifyArmadaVaultInfo } from './utils/stringifiers'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { createAdminSdkTestSetup } from './utils/createAdminSdkTestSetup'
import { TestClientIds, type TestConfigKey } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */

describe('Armada Protocol - Specific Vault', () => {
  const scenarios: { testConfigKey?: TestConfigKey; testClientId?: TestClientIds }[] = [
    { testConfigKey: 'MainnetETHDao' },
    // {
    //   testClientId: TestClientIds.ACME,
    // },
    // {
    //   testClientId: TestClientIds.Targen,
    // },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { testClientId, testConfigKey } = scenario

    it('should get specific vault info', async () => {
      // Choose SDK setup based on scenario
      const setup = testClientId
        ? createAdminSdkTestSetup(testClientId)
        : createSdkTestSetup(testConfigKey)
      const { sdk, chainId, fleetAddress, userAddress } = setup

      const sdkType = testClientId ? 'Admin SDK' : 'User SDK'
      console.log(
        `[${sdkType}] Running on chain ${chainId} for ${testClientId || testConfigKey} with user ${userAddress.value}`,
      )

      // Test for specific vault
      const vaultId = ArmadaVaultId.createFrom({
        chainInfo: getChainInfoByChainId(chainId),
        fleetAddress: Address.createFromEthereum({ value: fleetAddress.value }),
      })

      const vaultInfo = await sdk.armada.users.getVaultInfo({
        vaultId,
      })

      assert(vaultInfo != null, 'Vault not found')
      console.log(`[${sdkType}] Specific vault info:\n`, stringifyArmadaVaultInfo(vaultInfo))
      validateApys(vaultInfo)
    })
  })
})

function validateApys(vault: IArmadaVaultInfo) {
  assert(vault.apys != null, `Vault ${vault.id.toString()} should have apys property`)
  assert('live' in vault.apys, `Vault ${vault.id.toString()} apys should have live property`)
  assert('sma24h' in vault.apys, `Vault ${vault.id.toString()} apys should have sma24h property`)
  assert('sma7day' in vault.apys, `Vault ${vault.id.toString()} apys should have sma7day property`)
  assert(
    'sma30day' in vault.apys,
    `Vault ${vault.id.toString()} apys should have sma30day property`,
  )
}
