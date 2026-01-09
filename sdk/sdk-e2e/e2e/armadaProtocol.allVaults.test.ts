/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  getChainInfoByChainId,
  type IArmadaVaultInfo,
  ChainId,
  ChainIds,
  ArmadaVaultId,
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
    chainId: ChainId
    testClientId?: TestClientIds
  }[] = [
    { chainId: ChainIds.Base },
    { chainId: ChainIds.ArbitrumOne },
    { chainId: ChainIds.Mainnet },
    { chainId: ChainIds.Sonic },
    { chainId: ChainIds.Hyperliquid },
    {
      testClientId: TestClientIds.ACME,
      chainId: ChainIds.Base,
    },
    {
      testClientId: TestClientIds.Targen,
      chainId: ChainIds.Base,
    },
    {
      testClientId: TestClientIds.Targen,
      chainId: ChainIds.ArbitrumOne,
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { testClientId, chainId } = scenario

    it('should get all vaults with info', async () => {
      // Choose SDK setup based on scenario
      const setup = testClientId ? createAdminSdkTestSetup(testClientId) : createSdkTestSetup()
      const { sdk } = setup

      // Use chainId from scenario if provided, otherwise use default from setup
      const chainInfo = getChainInfoByChainId(chainId)

      const sdkType = testClientId ? 'Admin SDK' : 'User SDK'
      console.log(`[${sdkType}] Running on chain ${chainId} for ${testClientId}`)

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

      const vaultsRaw = await sdk.armada.users.getVaultsRaw({
        chainInfo,
      })
      if (!vaultsRaw || vaultsRaw.vaults.length === 0) {
        console.log('No raw vaults found')
      } else {
        console.log(
          `[${sdkType}] All raw vaults info:\n`,
          vaultsRaw.vaults
            .map((v) => {
              return `- id: ${v.id.toString()}, name: ${v.name}`
            })
            .join('\n'),
        )
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
