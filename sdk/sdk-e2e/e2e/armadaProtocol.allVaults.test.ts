/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  getChainInfoByChainId,
  type IArmadaVaultInfo,
  ChainId,
  ChainIds,
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

describe('Armada Protocol - All Vaults', () => {
  const scenarios: {
    testConfigKey?: TestConfigKey
    testClientId?: TestClientIds
    chainId?: ChainId
  }[] = [
    { testConfigKey: 'BaseUSDC' },
    {
      testClientId: TestClientIds.ACME,
    },
    {
      testClientId: TestClientIds.Targen,
      chainId: ChainIds.Base,
    },
    {
      testClientId: TestClientIds.Targen,
      chainId: ChainIds.ArbitrumOne,
    },
    {
      testClientId: TestClientIds.Targen,
      chainId: ChainIds.Mainnet,
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { testConfigKey, testClientId, chainId: scenarioChainId } = scenario

    it('should get all vaults with info', async () => {
      // Choose SDK setup based on scenario
      const setup = testClientId
        ? createAdminSdkTestSetup(testClientId)
        : createSdkTestSetup(testConfigKey)
      const { sdk, chainId: defaultChainId, userAddress } = setup

      // Use chainId from scenario if provided, otherwise use default from setup
      const chainId = scenarioChainId ?? defaultChainId

      const sdkType = testClientId ? 'Admin SDK' : 'User SDK'
      console.log(
        `[${sdkType}] Running on chain ${chainId} for ${testClientId || testConfigKey} with user ${userAddress.value}`,
      )

      // Test for all vaults
      const vaults = await sdk.armada.users.getVaultInfoList({
        chainId,
      })

      if (!vaults.list || vaults.list.length === 0) {
        console.log('No vaults found')
      } else {
        console.log(
          `[${sdkType}] All vaults info:\n`,
          vaults.list.map(stringifyArmadaVaultInfo).join('\n'),
        )
        vaults.list.forEach(validateApys)
      }
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
