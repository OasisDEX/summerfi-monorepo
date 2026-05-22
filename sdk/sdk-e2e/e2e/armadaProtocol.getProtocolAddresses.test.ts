import assert from 'assert'
import { ChainIds } from '@summerfi/sdk-common'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */

const EXPECTED_ADDRESSES: Record<number, { admiralsQuarters: string }> = {
  [ChainIds.Base]: { admiralsQuarters: '0x2e4AC08988c3a995A290Da2655664a8dEF92675F' },
  [ChainIds.ArbitrumOne]: { admiralsQuarters: '0x20aF9545eBb320c80C5736880bAA7a244a75868f' },
  [ChainIds.Mainnet]: { admiralsQuarters: '0x09124a25756223Eb7A523A0377cc83Dc8D22e1bE' },
  [ChainIds.Sonic]: { admiralsQuarters: '0xAf755eD8D76Fdceab2B1cdC0d4C8C94f4e8eEe54' },
  [ChainIds.Hyperliquid]: { admiralsQuarters: '0x13c93bB39F8f6F08310522DD447d18683aB3ca51' },
}

describe('Armada Protocol - getProtocolAddresses', () => {
  const scenarios = [
    { chainId: ChainIds.Base },
    { chainId: ChainIds.ArbitrumOne },
    { chainId: ChainIds.Mainnet },
    { chainId: ChainIds.Sonic },
    { chainId: ChainIds.Hyperliquid },
  ] as const

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { chainId } = scenario

    it('should return protocol addresses for the chain', async () => {
      const { sdk } = createSdkTestSetup({ chainId })

      const addresses = await sdk.armada.users.getProtocolAddresses({ chainId })

      console.log(
        `[getProtocolAddresses] chainId=${chainId} admiralsQuarters=${addresses.admiralsQuarters}`,
      )

      assert(addresses != null, 'Expected addresses to be returned')
      assert(
        typeof addresses.admiralsQuarters === 'string',
        'Expected admiralsQuarters to be a string',
      )
      assert(
        addresses.admiralsQuarters.startsWith('0x'),
        'Expected admiralsQuarters to be a hex address',
      )

      const expected = EXPECTED_ADDRESSES[chainId]
      assert(expected != null, `No expected address configured for chainId ${chainId}`)
      assert.strictEqual(
        addresses.admiralsQuarters.toLowerCase(),
        expected.admiralsQuarters.toLowerCase(),
        `admiralsQuarters mismatch for chainId ${chainId}`,
      )
    })
  })
})
