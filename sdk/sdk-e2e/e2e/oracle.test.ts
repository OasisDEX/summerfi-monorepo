import { ChainIds, FiatCurrency, getChainInfoByChainId } from '@summerfi/sdk-common'

import { createTestSDK } from './utils/sdkInstance'
import type { OracleScenario } from './utils/types'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Oracle Tests', () => {
  const sdk = createTestSDK()

  // Configure test scenarios here
  const spotPriceScenarios: OracleScenario[] = [
    {
      description: 'get spot price on Base',
      chainId: ChainIds.Base,
      baseTokenSymbol: 'eth',
      denominationTokenSymbol: 'weth',
    },
    {
      description: 'get spot price on Mainnet',
      chainId: ChainIds.Mainnet,
      baseTokenSymbol: 'wbtc',
      denominationFiat: FiatCurrency.USD,
    },
    {
      description: 'get spot price on Arbitrum One',
      chainId: ChainIds.ArbitrumOne,
      baseTokenSymbol: 'weth',
      denominationTokenSymbol: 'eth',
    },
    {
      description: 'get spot price on Sonic',
      chainId: ChainIds.Sonic,
      baseTokenSymbol: 's',
      denominationFiat: FiatCurrency.USD,
    },
  ]

  describe('getSpotPrice', () => {
    test.each(spotPriceScenarios)(
      'should $description',
      async ({ chainId, baseTokenSymbol, denominationTokenSymbol, denominationFiat }) => {
        const baseToken = await sdk.tokens.getTokenBySymbol({ chainId, symbol: baseTokenSymbol })

        const denomination = denominationTokenSymbol
          ? await sdk.tokens.getTokenBySymbol({ chainId, symbol: denominationTokenSymbol })
          : denominationFiat

        const spot = await sdk.oracle.getSpotPrice({
          baseToken,
          denomination,
        })

        expect(spot).toBeDefined()
        expect(spot.price).toBeDefined()
        expect(spot.token).toBeDefined()
        expect(spot.provider).toBeDefined()

        console.log(
          `Spot price for ${spot.token.toString()}:\n`,
          spot.price.toString(),
          '(provider:' + spot.provider.toString() + ')',
        )
      },
    )
  })

  describe('getSpotPrices', () => {
    it('should get spot prices for multiple tokens on Base', async () => {
      const chainId = ChainIds.Base
      const chainInfo = getChainInfoByChainId(chainId)

      const baseTokens = await Promise.all([
        sdk.tokens.getTokenBySymbol({ chainId, symbol: 'usdc' }),
        sdk.tokens.getTokenBySymbol({ chainId, symbol: 'eth' }),
        sdk.tokens.getTokenBySymbol({ chainId, symbol: 'wsteth' }),
      ])

      const spotPrices = await sdk.oracle.getSpotPrices({
        chainInfo,
        baseTokens,
        quoteCurrency: FiatCurrency.USD,
      })

      expect(spotPrices).toBeDefined()
      expect(spotPrices.provider).toBeDefined()
      expect(spotPrices.priceByAddress).toBeDefined()
      expect(Object.keys(spotPrices.priceByAddress).length).toBe(baseTokens.length)

      const text = baseTokens.map((token) => {
        const price = spotPrices.priceByAddress[token.address.value.toLowerCase()]
        return `- ${token.symbol}: ${price.toString()} (provider: ${spotPrices.provider.toString()})`
      })
      console.log('Multiple spot prices:\n' + text.join('\n'))
    })
  })
})
