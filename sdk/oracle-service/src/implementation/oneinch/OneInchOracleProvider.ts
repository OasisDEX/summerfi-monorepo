import {
  OneInchOracleProviderConfig,
  OneInchSpotAuthHeader,
  OneInchSpotAuthHeaderKey,
  OneInchSpotResponse,
} from './Types'

import fetch from 'node-fetch'
import {
  type ChainInfo,
  Token,
  Address,
  Price,
  type AddressValue,
  ChainId,
  isToken,
  Denomination,
  isFiatCurrencyAmount,
} from '@summerfi/sdk-common/common'
import { OracleProviderType, SpotPriceInfo } from '@summerfi/sdk-common/oracle'
import { IOracleProvider } from '@summerfi/oracle-common'
import { FiatCurrency, IChainInfo, IToken, isTokenAmount } from '@summerfi/sdk-common'

/**
 * @name OneInchOracleProvider
 * @description This class is responsible for fetching spot prices from the 1inch API
 */
export class OneInchOracleProvider implements IOracleProvider {
  public type: OracleProviderType = OracleProviderType.OneInch

  private readonly _apiUrl: string
  private readonly _apiKey: string
  private readonly _version: string

  /** CONSTRUCTOR */

  /**
   * @param params The configuration parameters for the 1inch oracle provider
   */
  constructor(params: { providerConfig: OneInchOracleProviderConfig }) {
    const { providerConfig } = params

    this._apiUrl = providerConfig.apiUrl
    this._apiKey = providerConfig.apiKey
    this._version = providerConfig.version
  }

  /** @see IOracleProvider.getSupportedChainIds */
  getSupportedChainIds(): ChainId[] {
    return [1]
  }

  /** @see IOracleProvider.getSpotPrice */
  async getSpotPrice(params: {
    chainInfo: IChainInfo
    baseToken: IToken
    quoteDenomination?: Denomination
  }): Promise<SpotPriceInfo> {
    const authHeader = this._getOneInchSpotAuthHeader()
    if (params.quoteDenomination && isToken(params.quoteDenomination)) {
      isTokenType(params.quoteDenomination)

      const baseTokenAddress = params.baseToken.address
      const quoteTokenAddress = params.quoteDenomination.address
      const quoteCurrencySymbol = FiatCurrency.USD

      const spotUrl = this._formatOneInchSpotUrl({
        chainInfo: params.chainInfo,
        tokenAddresses: [baseTokenAddress, quoteTokenAddress],
        // We use USD as base for both tokens and then derive a spot price
        quoteCurrency: quoteCurrencySymbol,
      })

      const response = await fetch(spotUrl, {
        headers: authHeader,
      })

      if (!(response.status === 200 && response.statusText === 'OK')) {
        throw new Error(
          `Error performing 1inch spot price request ${spotUrl}: ${JSON.stringify(await response.statusText)}`,
        )
      }

      const responseData = (await response.json()) as OneInchSpotResponse
      const baseToken = params.baseToken
      const quoteToken = params.quoteDenomination
      const prices = Object.entries(responseData).map(([address, price]) => {
        const isBaseToken = baseToken.address.equals(
          Address.createFromEthereum({ value: address as AddressValue }),
        )
        return Price.createFrom({
          value: price.toString(),
          base: isBaseToken ? baseToken : quoteToken,
          quote: quoteCurrencySymbol,
        })
      })

      const baseTokenPriceQuotedInCurrencySymbol = prices.find(
        (p) => isToken(p.base) && p.base.address.equals(baseToken.address),
      )
      const quoteTokenPriceQuoteInCurrencySymbol = prices.find(
        (p) => isToken(p.base) && p.base.address.equals(quoteToken.address),
      )

      if (!baseTokenPriceQuotedInCurrencySymbol || !quoteTokenPriceQuoteInCurrencySymbol) {
        throw new Error('BaseToken | QuoteToken spot prices could not be determined')
      }

      const resultingPrice = baseTokenPriceQuotedInCurrencySymbol.divide(
        quoteTokenPriceQuoteInCurrencySymbol,
      )
      if (isTokenAmount(resultingPrice) || isFiatCurrencyAmount(resultingPrice)) {
        throw new Error('Resulting price is not a proper price, check the quote and base tokens')
      }

      return {
        provider: OracleProviderType.OneInch,
        token: baseToken,
        price: resultingPrice,
      }
    } else {
      const quoteCurrency = params.quoteDenomination ?? FiatCurrency.USD
      const baseToken = params.baseToken
      const spotUrl = this._formatOneInchSpotUrl({
        chainInfo: params.chainInfo,
        tokenAddresses: [baseToken.address],
        quoteCurrency: quoteCurrency,
      })

      const response = await fetch(spotUrl, {
        headers: authHeader,
      })

      if (!(response.status === 200 && response.statusText === 'OK')) {
        throw new Error(
          `Error performing 1inch spot price request ${spotUrl}: ${await response.body}`,
        )
      }

      const responseData = (await response.json()) as OneInchSpotResponse

      const [, price] = Object.entries(responseData)[0]

      return {
        provider: OracleProviderType.OneInch,
        token: baseToken,
        price: Price.createFrom({
          value: price.toString(),
          base: baseToken,
          quote: quoteCurrency,
        }),
      }
    }
  }

  private _getOneInchSpotAuthHeader(): OneInchSpotAuthHeader {
    return { [OneInchSpotAuthHeaderKey]: `Bearer ${this._apiKey}` }
  }

  private _formatOneInchSpotUrl(params: {
    chainInfo: ChainInfo
    tokenAddresses: Address[]
    quoteCurrency: FiatCurrency
  }): string {
    const chainId = params.chainInfo.chainId
    const tokenAddresses = params.tokenAddresses.map((address) => address.value.toLowerCase())

    /**
     * apiSpotUrl includes the complete path for the spot price endpoint
     * EG <url>/price/v1.1
     * https://portal.1inch.dev/documentation/spot-price/swagger?method=get&path=%2Fv1.1%2F1%2F%7Baddresses%7D
     */
    return `${this._apiUrl}/price/${this._version}/${chainId}/${tokenAddresses.join(',')}?currency=${params.quoteCurrency.toUpperCase()}`
  }
}

function isTokenType(quoteToken: unknown): asserts quoteToken is Token {
  if (!quoteToken) {
    throw new Error('QuoteToken is undefined')
  }
  if (!(quoteToken instanceof Token)) {
    throw new Error('QuoteToken is not of type Token')
  }
}
