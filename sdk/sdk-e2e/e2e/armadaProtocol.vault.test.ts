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
import type { VaultInfoScenario } from './utils/types'
import { ClientIds } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */

describe('Armada Protocol - Vault', () => {
  const scenarios: VaultInfoScenario[] = [
    // {
    //   description: 'get all vaults with info',
    //   testSpecificVault: false,
    // },
    // {
    //   description: 'get specific vault info',
    //   testSpecificVault: true,
    // },
    // {
    //   description: 'get all vaults with info for ACME',
    //   clientId: ClientIds.ACME,
    //   testSpecificVault: false,
    // },
    // {
    //   description: 'get specific vault info for ACME',
    //   clientId: ClientIds.ACME,
    //   testSpecificVault: true,
    // },
    {
      description: 'get all vaults with info for Targen',
      clientId: ClientIds.Targen,
      testSpecificVault: false,
    },
    {
      description: 'get specific vault info for Targen',
      clientId: ClientIds.Targen,
      testSpecificVault: true,
    },
  ]

  test.each(scenarios)(
    'should $description',
    async ({ description, clientId, testSpecificVault = false }) => {
      // Choose SDK setup based on scenario
      const setup = clientId ? createAdminSdkTestSetup(clientId) : createSdkTestSetup()
      const { sdk, chainId, fleetAddress, userAddress } = setup

      const chainInfo = getChainInfoByChainId(chainId)
      const sdkType = clientId ? 'Admin SDK' : 'User SDK'
      console.log(`[${sdkType}] Running on ${chainInfo.name} for user ${userAddress.value}`)

      // Test for specific vault
      if (testSpecificVault) {
        const vaultId = ArmadaVaultId.createFrom({
          chainInfo,
          fleetAddress: Address.createFromEthereum({ value: fleetAddress.value }),
        })

        const vaultInfo = await sdk.armada.users.getVaultInfo({
          vaultId,
        })

        assert(vaultInfo != null, 'Vault not found')
        console.log(`[${sdkType}] Specific vault info:\n`, stringifyArmadaVaultInfo(vaultInfo))
        validateApys(vaultInfo)
      }
      // Test for all vaults
      else {
        const vaults = await sdk.armada.users.getVaultInfoList({
          chainId,
        })

        assert(vaults.list.length > 0, 'No vaults found')
        console.log(
          `[${sdkType}] All vaults info:\n`,
          vaults.list.map(stringifyArmadaVaultInfo).join('\n'),
        )
        vaults.list.forEach(validateApys)
      }
    },
  )
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
