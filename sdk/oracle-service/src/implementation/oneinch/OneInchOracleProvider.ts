import {
  OneInchOracleProviderConfig,
  OneInchSpotAuthHeader,
  OneInchSpotAuthHeaderKey,
  OneInchSpotResponse,
} from './Types'

import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IOracleProvider } from '@summerfi/oracle-common'
import { FiatCurrency, IAddress, IChainInfo, IToken, isTokenAmount } from '@summerfi/sdk-common'
import {
  Address,
  ChainId,
  Denomination,
  Price,
  isFiatCurrencyAmount,
  isToken,
  type AddressValue,
} from '@summerfi/sdk-common/common'
import { OracleProviderType, SpotPriceInfo } from '@summerfi/sdk-common/oracle'
import { ManagerProviderBase } from '@summerfi/sdk-server-common'
import fetch from 'node-fetch'

/**
 * @name OneInchOracleProvider
 * @description This class is responsible for fetching spot prices from the 1inch API
 */
export class OneInchOracleProvider
  extends ManagerProviderBase<OracleProviderType>
  implements IOracleProvider
{
  private readonly _apiUrl: string
  private readonly _apiKey: string
  private readonly _version: string

  /** CONSTRUCTOR */

  constructor(params: { configProvider: IConfigurationProvider }) {
    super({ ...params, type: OracleProviderType.OneInch })

    const { config } = this._getConfig()

    this._apiUrl = config.apiUrl
    this._apiKey = config.apiKey
    this._version = config.version
  }

  /** @see IOracleProvider.getSupportedChainIds */
  getSupportedChainIds(): ChainId[] {
    return [1, 10, 8453, 42161]
  }

  /** @see IOracleProvider.getSpotPrice */
  async getSpotPrice(params: {
    baseToken: IToken
    quoteToken?: Denomination
  }): Promise<SpotPriceInfo> {
    const authHeader = this._getOneInchSpotAuthHeader()

    if (params.quoteToken && isToken(params.quoteToken)) {
      const baseTokenAddress = params.baseToken.address
      const quoteTokenAddress = params.quoteToken.address
      const quoteCurrencySymbol = FiatCurrency.USD

      const spotUrl = this._formatOneInchSpotUrl({
        chainInfo: params.baseToken.chainInfo,
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
      const quoteToken = params.quoteToken
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
      const quoteCurrency = params.quoteToken ?? FiatCurrency.USD
      const baseToken = params.baseToken

      const spotUrl = this._formatOneInchSpotUrl({
        chainInfo: params.baseToken.chainInfo,
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

  /**
   * Returns the authentication header for the 1inch spot price API
   * @returns  The authentication header with the API key
   */
  private _getOneInchSpotAuthHeader(): OneInchSpotAuthHeader {
    return { [OneInchSpotAuthHeaderKey]: `Bearer ${this._apiKey}` }
  }

  /**
   * Formats the 1inch spot price URL
   * @param chainInfo The chain information
   * @param tokenAddresses The token addresses to get the spot price for
   * @param quoteCurrency The quote currency in which the spot prices will be denominated
   *
   * @returns The formatted spot price URL
   */
  private _formatOneInchSpotUrl(params: {
    chainInfo: IChainInfo
    tokenAddresses: IAddress[]
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

  /**
   * Returns the configuration for the 1inch oracle provider
   * @returns The 1inch oracle provider configuration
   */
  private _getConfig(): {
    config: OneInchOracleProviderConfig
  } {
    const ONE_INCH_API_SPOT_URL = this.configProvider.getConfigurationItem({
      name: 'ONE_INCH_API_SPOT_URL',
    })
    const ONE_INCH_API_SPOT_VERSION = this.configProvider.getConfigurationItem({
      name: 'ONE_INCH_API_SPOT_VERSION',
    })
    const ONE_INCH_API_SPOT_KEY = this.configProvider.getConfigurationItem({
      name: 'ONE_INCH_API_SPOT_KEY',
    })

    if (!ONE_INCH_API_SPOT_URL || !ONE_INCH_API_SPOT_KEY || !ONE_INCH_API_SPOT_VERSION) {
      console.error(
        JSON.stringify(
          Object.entries({
            ONE_INCH_API_SPOT_URL,
            ONE_INCH_API_SPOT_KEY,
            ONE_INCH_API_SPOT_VERSION,
          }),
          null,
          2,
        ),
      )
      throw new Error('OneInch configuration is missing, check logs for more information')
    }

    return {
      config: {
        apiUrl: ONE_INCH_API_SPOT_URL,
        apiKey: ONE_INCH_API_SPOT_KEY,
        version: ONE_INCH_API_SPOT_VERSION,
      },
    }
  }
}
