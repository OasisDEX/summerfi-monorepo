/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChainIds, getChainInfoByChainId, type IRwaVaultInfo } from '@summerfi/sdk-common'

import assert from 'assert'
import { stringifyRwaVaultInfo } from './utils/stringifiers'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { RwaTestConfig } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */

describe('RWA - All Vaults', () => {
  const scenarios: {
    chainId: typeof ChainIds.Base
    institutionId: string
  }[] = [
    {
      chainId: RwaTestConfig.chainId,
      institutionId: RwaTestConfig.institutionId,
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { chainId, institutionId } = scenario

    it('should get all RWA vaults with info', async () => {
      const setup = createSdkTestSetup({ chainId })
      const { sdk } = setup

      const chainInfo = getChainInfoByChainId(chainId)

      console.log(
        `[RWA SDK] Running on chain ${chainId} (${chainInfo.name}) for institutionId ${institutionId}`,
      )

      const vaults = await sdk.rwa.getVaultInfoListPerChain({
        chainId,
        institutionId,
      })

      if (!vaults.list || vaults.list.length === 0) {
        console.log('No RWA vaults found')
      } else {
        console.log(`[RWA SDK] All vaults info:\n`, vaults.list.map(stringifyRwaVaultInfo).join('\n'))
        vaults.list.forEach(validateApys)
      }
    })
  })
})

function validateApys(vault: IRwaVaultInfo) {
  assert(vault.apys != null, `Vault ${vault.id.toString()} should have apys property`)
  assert('live' in vault.apys, `Vault ${vault.id.toString()} apys should have live property`)
  assert('sma24h' in vault.apys, `Vault ${vault.id.toString()} apys should have sma24h property`)
  assert('sma7day' in vault.apys, `Vault ${vault.id.toString()} apys should have sma7day property`)
  assert(
    'sma30day' in vault.apys,
    `Vault ${vault.id.toString()} apys should have sma30day property`,
  )
}
