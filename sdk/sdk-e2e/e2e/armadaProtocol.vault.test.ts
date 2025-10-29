/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Address,
  ArmadaVaultId,
  getChainInfoByChainId,
  type IArmadaVaultInfo,
} from '@summerfi/sdk-common'

import { createTestSDK } from './utils/sdkInstance'
import assert from 'assert'
import { stringifyArmadaVaultInfo } from './utils/stringifiers'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { createAdminSdkTestSetup } from './utils/createAdminSdkTestSetup'
import type { VaultInfoScenario } from './utils/types'

jest.setTimeout(300000)

/**
 * @group e2e
 */

describe('Armada Protocol - Vault', () => {
  const scenarios: VaultInfoScenario[] = [
    // {
    //   description: 'get all vaults with info (User SDK)',
    //   useAdminSdk: false,
    //   testSpecificVault: false,
    // },
    // {
    //   description: 'get specific vault info (User SDK)',
    //   useAdminSdk: false,
    //   testSpecificVault: true,
    // },
    {
      description: 'admin can get all vaults with info (Admin SDK)',
      useAdminSdk: true,
      testSpecificVault: false,
    },
    {
      description: 'admin can get specific vault info (Admin SDK)',
      useAdminSdk: true,
      testSpecificVault: true,
    },
  ]

  test.each(scenarios)(
    'should $description',
    async ({ description, useAdminSdk = false, testSpecificVault = false }) => {
      // Choose SDK setup based on scenario
      const setup = useAdminSdk ? createAdminSdkTestSetup() : createSdkTestSetup()
      const { sdk, chainId, fleetAddress, userAddress } = setup

      const chainInfo = getChainInfoByChainId(chainId)
      const sdkType = useAdminSdk ? 'Admin SDK' : 'User SDK'
      console.log(`[${sdkType}] Running on ${chainInfo.name} for user ${userAddress.value}`)

      if (testSpecificVault) {
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
      } else {
        // Test for all vaults
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
