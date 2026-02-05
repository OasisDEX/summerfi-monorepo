import { getChainInfoByChainId } from '@summerfi/sdk-common'

import { TestConfigs } from './utils/testConfig'
import { createTestSdkInstance } from './utils/createTestSdkInstance'
import assert from 'assert'

jest.setTimeout(300000)

describe('Armada Protocol - Vaults Historical Rates', () => {
  const { chainId, fleetAddressValue } = TestConfigs.InstiBaseUSDC

  const chainInfo = getChainInfoByChainId(chainId)

  console.log(`Running on ${chainInfo.name} for chainId ${chainId}`)

  const sdk = createTestSdkInstance()

  it('should fetch historical rates for given fleets', async () => {
    const result = await sdk.armada.users.getVaultsHistoricalRates({
      fleets: [
        {
          fleetAddress: fleetAddressValue,
          chainId,
        },
      ],
    })

    console.log('Historical rates result:', JSON.stringify(result))

    // basic assertions on the shape
    assert(Array.isArray(result), 'Result should be an array')
    if (result.length > 0) {
      const r = result[0]
      assert(
        typeof r.chainId === 'string' || typeof r.chainId === 'number',
        'chainId should be present',
      )
      assert(typeof r.fleetAddress === 'string', 'fleetAddress should be present')
      assert(r.rates != null, 'rates should be present')
    }
  })
})
