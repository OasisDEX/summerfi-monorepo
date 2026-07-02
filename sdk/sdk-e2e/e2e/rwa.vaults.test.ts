/* eslint-disable @typescript-eslint/no-unused-vars */
import { getChainInfoByChainId, type IRwaVaultInfo } from '@summerfi/sdk-common'

import assert from 'assert'
import { stringifyRwaVaultInfo } from './utils/stringifiers'
import { TestClientIds } from './utils/testConfig'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */

describe('RWA - All Vaults', () => {
  const scenarios: {
    clientId: TestClientIds
  }[] = [
    {
      clientId: TestClientIds.Orthodox,
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { clientId } = scenario

    it('should get all RWA vaults with info', async () => {
      const setup = createInstiSdkTestSetup({ clientId })
      const { sdk, chainId } = setup

      const chainInfo = getChainInfoByChainId(chainId)

      console.log(
        `[RWA SDK] Running on chain ${chainId} (${chainInfo.name}) for clientId ${clientId}`,
      )

      const vaults = await sdk.rwa.getVaultInfoListPerChain({
        chainId,
        clientId,
      })

      if (!vaults.list || vaults.list.length === 0) {
        console.log('No RWA vaults found')
      } else {
        console.log(
          `[RWA SDK] All vaults info:\n`,
          vaults.list.map(stringifyRwaVaultInfo).join('\n'),
        )
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
