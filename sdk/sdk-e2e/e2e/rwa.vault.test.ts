/* eslint-disable @typescript-eslint/no-unused-vars */
import { type IRwaVaultInfo } from '@summerfi/sdk-common'

import assert from 'assert'
import { stringifyRwaVaultInfo } from './utils/stringifiers'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { TestClientIds } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */

describe('RWA - Specific Vault', () => {
  const scenarios: {
    clientId: TestClientIds
  }[] = [
    {
      clientId: TestClientIds.ACME_v2,
    },
    {
      clientId: TestClientIds.Orthodox,
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { clientId } = scenario

    it('should get a specific RWA vault info via the list', async () => {
      const setup = createInstiSdkTestSetup({ clientId })
      const { sdk, chainId } = setup

      console.log(`[RWA SDK] Running on chain ${chainId} for clientId ${clientId}`)

      const vaults = await sdk.rwa.getVaultInfoListPerChain({
        chainId,
        clientId,
      })

      assert(vaults.list.length > 0, 'No RWA vaults returned for institution')

      const vaultInfo = vaults.list[0]
      console.log(`[RWA SDK] Specific vault info:\n`, stringifyRwaVaultInfo(vaultInfo))
      validateApys(vaultInfo)
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
