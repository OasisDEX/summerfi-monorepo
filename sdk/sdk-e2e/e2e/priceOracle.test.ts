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
      // ETH on Base
      // {
      //   chainId: ChainIds.Base,
      //   baseTokenSymbol: 'eth',
      //   denominationTokenSymbol: 'weth',
      // },
      // {
      //   chainId: ChainIds.Base,
      //   baseTokenSymbol: 'eth',
      //   denominationTokenSymbol: 'usdc',
      // },
      // {
      //   chainId: ChainIds.Base,
      //   baseTokenSymbol: 'eth',
      //   denominationFiat: FiatCurrency.USD,
      // },
      // SUMR/USDC
      {
        chainId: ChainIds.Base,
        baseTokenSymbol: 'sumr',
        denominationTokenSymbol: 'usdc',
      },
      {
        chainId: ChainIds.Mainnet,
        baseTokenSymbol: 'sumr',
        denominationTokenSymbol: 'usdc',
      },
      {
        chainId: ChainIds.ArbitrumOne,
        baseTokenSymbol: 'sumr',
        denominationTokenSymbol: 'usdc',
      },
      {
        chainId: ChainIds.Sonic,
        baseTokenSymbol: 'sumr',
        denominationTokenSymbol: 'usdc.e',
      },
      {
        chainId: ChainIds.Hyperliquid,
        baseTokenSymbol: 'sumr',
        denominationTokenSymbol: 'usdc',
      },
      // SUMR/USD
      {
        chainId: ChainIds.Base,
        baseTokenSymbol: 'sumr',
        denominationFiat: FiatCurrency.USD,
      },

      {
        chainId: ChainIds.Mainnet,
        baseTokenSymbol: 'sumr',
        denominationFiat: FiatCurrency.USD,
      },
      {
        chainId: ChainIds.ArbitrumOne,
        baseTokenSymbol: 'sumr',
        denominationFiat: FiatCurrency.USD,
      },
      {
        chainId: ChainIds.Sonic,
        baseTokenSymbol: 'sumr',
        denominationFiat: FiatCurrency.USD,
      },
      {
        chainId: ChainIds.Hyperliquid,
        baseTokenSymbol: 'sumr',
        denominationFiat: FiatCurrency.USD,
      },
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
          `${spot.token.toString()} price in ${denomination} on ${chainId}:\n`,
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
