import { ChainIds, FiatCurrency, getChainInfoByChainId, type ChainId } from '@summerfi/sdk-common'

import { createTestSDK } from './utils/sdkInstance'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Oracle Tests', () => {
  const sdk = createTestSDK()

  describe('getSpotPrice', () => {
    // Configure test scenarios here
    const spotPriceScenarios: {
      chainId: ChainId
      baseTokenSymbol: string
      denominationTokenSymbol?: string
      denominationFiat?: FiatCurrency
    }[] = [
      {
        chainId: ChainIds.Base,
        baseTokenSymbol: 'eth',
        denominationTokenSymbol: 'weth',
      },
      {
        chainId: ChainIds.Base,
        baseTokenSymbol: 'eth',
        denominationFiat: FiatCurrency.USD,
      },

      {
        chainId: ChainIds.Base,
        baseTokenSymbol: 'sumr',
        denominationTokenSymbol: 'weth',
      },
      {
        chainId: ChainIds.Base,
        baseTokenSymbol: 'sumr',
        denominationFiat: FiatCurrency.USD,
      },

      // {
      //   chainId: ChainIds.Mainnet,
      //   baseTokenSymbol: 'wbtc',
      //   denominationFiat: FiatCurrency.USD,
      // },
      // {
      //   chainId: ChainIds.ArbitrumOne,
      //   baseTokenSymbol: 'weth',
      //   denominationTokenSymbol: 'eth',
      // },
      // {
      //   chainId: ChainIds.Sonic,
      //   baseTokenSymbol: 's',
      //   denominationFiat: FiatCurrency.USD,
      // },
    ]

    test.each(spotPriceScenarios)(
      'should get spot price for $baseTokenSymbol on chain $chainId',
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

  describe.skip('getSpotPrices', () => {
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
