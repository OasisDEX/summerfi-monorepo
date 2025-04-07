import { OneInchSpotResponse } from './Types'

import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IOracleProvider } from '@summerfi/oracle-common'
import {
  FiatCurrency,
  IAddress,
  IChainInfo,
  SwapErrorType,
  ChainId,
  Price,
  isToken,
  LoggingService,
} from '@summerfi/sdk-common'
import { OracleProviderType } from '@summerfi/sdk-common/oracle'
import { ManagerProviderBase } from '@summerfi/sdk-server-common'
import fetch from 'node-fetch'
import type { OracleProviderConfig } from '../Types'
import { BigNumber } from 'bignumber.js'

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
  private readonly _authHeader: string
  private readonly _supportedChainIds: ChainId[]

  /** CONSTRUCTOR */

  constructor(params: { configProvider: IConfigurationProvider }) {
    super({ ...params, type: OracleProviderType.OneInch })

    const { config } = this._getConfig()

    this._apiUrl = config.apiUrl
    this._apiKey = config.apiKey
    this._version = config.version
    this._authHeader = config.authHeader
    const supportedChainIds = params.configProvider.getConfigurationItem({
      name: 'ONE_INCH_SWAP_CHAIN_IDS',
    })
    this._supportedChainIds = supportedChainIds.split(',').map((id) => parseInt(id))
  }

  /** @see IOracleProvider.getSupportedChainIds */
  getSupportedChainIds(): ChainId[] {
    return this._supportedChainIds
  }

  /** @see IOracleProvider.getSpotPrice */
  async getSpotPrice(
    params: Parameters<IOracleProvider['getSpotPrice']>[0],
  ): ReturnType<IOracleProvider['getSpotPrice']> {
    const authHeader = this._getOneInchSpotAuthHeader()

    if (params.denomination && isToken(params.denomination)) {
      const baseToken = params.baseToken
      const quoteToken = params.denomination
      const quoteCurrencySymbol = FiatCurrency.USD

      const spotUrl = this._formatSpotUrl({
        chainInfo: params.baseToken.chainInfo,
        tokenAddresses: [baseToken.address, quoteToken.address],
        // We use USD as base for both tokens and then derive a spot price
        quoteCurrency: quoteCurrencySymbol,
      })
      LoggingService.debug('OneInchSpotPriceUrl', spotUrl)

      const response = await fetch(spotUrl, {
        headers: authHeader,
      })

      if (!response.ok) {
        const errorJSON = await response.text()
        const errorType = this._parseErrorType(errorJSON)

        throw Error(
          `Error performing 1inch spot price request: ${JSON.stringify({
            apiQuery: spotUrl,
            statusCode: response.status,
            json: errorJSON,
            subtype: errorType,
          })}`,
        )
      }

      const responseData = (await response.json()) as OneInchSpotResponse

      const baseUSDPrice = responseData[params.baseToken.address.value.toLowerCase()]
      const quoteUSDPrice = responseData[params.denomination.address.value.toLowerCase()]
      // price cannot undefined
      if (!baseUSDPrice || !quoteUSDPrice) {
        throw Error(
          'BaseToken or QuoteToken spot prices could not be retrieved: ' +
            JSON.stringify(responseData),
        )
      }
      // price cannot be zero or negative
      if (BigNumber(baseUSDPrice).isZero() || BigNumber(quoteUSDPrice).isZero()) {
        throw Error(
          'BaseToken or QuoteToken spot prices retrieved zero value: ' +
            JSON.stringify({
              baseUSDPrice,
              quoteUSDPrice,
            }),
        )
      } else if (BigNumber(baseUSDPrice).isNegative() || BigNumber(quoteUSDPrice).isNegative()) {
        throw Error(
          'BaseToken or QuoteToken spot prices retrieved negative value: ' +
            JSON.stringify({
              baseUSDPrice,
              quoteUSDPrice,
            }),
        )
      }

      const value = BigNumber(baseUSDPrice).div(quoteUSDPrice).toString()

      return {
        provider: OracleProviderType.OneInch,
        token: baseToken,
        price: Price.createFrom({
          value: value,
          base: baseToken,
          quote: params.denomination,
        }),
      }
    } else {
      const quoteCurrency = params.denomination ?? FiatCurrency.USD
      const baseToken = params.baseToken

      const spotUrl = this._formatSpotUrl({
        chainInfo: params.baseToken.chainInfo,
        tokenAddresses: [baseToken.address],
        quoteCurrency: quoteCurrency,
      })

      const response = await fetch(spotUrl, {
        headers: authHeader,
      })

      if (!response.ok) {
        const errorJSON = await response.text()
        const errorType = this._parseErrorType(errorJSON)

        throw Error(
          `Error performing 1inch spot price request: ${JSON.stringify({
            apiQuery: spotUrl,
            statusCode: response.status,
            json: errorJSON,
            subtype: errorType,
          })}`,
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

  /** @see IOracleProvider.getSpotPrices */
  async getSpotPrices(
    params: Parameters<IOracleProvider['getSpotPrices']>[0],
  ): ReturnType<IOracleProvider['getSpotPrices']> {
    const authHeader = this._getOneInchSpotAuthHeader()

    const quote = params.quoteCurrency ?? FiatCurrency.USD

    const spotUrl = this._formatSpotUrl({
      chainInfo: params.chainInfo,
      tokenAddresses: params.baseTokens.map((token) => token.address),
      quoteCurrency: params.quoteCurrency,
    })
    LoggingService.debug('OneInchSpotPricesUrl', spotUrl)

    const response = await fetch(spotUrl, {
      headers: authHeader,
    })

    if (!response.ok) {
      const errorJSON = await response.text()
      const errorType = this._parseErrorType(errorJSON)

      throw Error(
        `Error performing 1inch spot price request: ${JSON.stringify({
          apiQuery: spotUrl,
          statusCode: response.status,
          json: errorJSON,
          subtype: errorType,
        })}`,
      )
    }

    const responseData = (await response.json()) as OneInchSpotResponse

    const priceByAddress = Object.fromEntries(
      Object.entries(responseData).map(([address, price]) => {
        const base = params.baseTokens.find(
          (t) => t.address.value.toLowerCase() === address.toLowerCase(),
        )
        if (!base) {
          throw new Error(
            `Token with address ${address} not found in base tokens: ${params.baseTokens.map((t) => t.address.value)}`,
          )
        }
        return [address.toLowerCase(), Price.createFrom({ value: price.toString(), base, quote })]
      }),
    )

    return {
      provider: OracleProviderType.OneInch,
      priceByAddress,
    }
  }

  /**
   * Returns the authentication header for the 1inch spot price API
   * @returns  The authentication header with the API key
   */
  private _getOneInchSpotAuthHeader() {
    return {
      [this._authHeader]: `Bearer ${this._apiKey}`,
      'Content-Type': 'application/json',
    }
  }

  /**
   * Formats the 1inch spot price URL
   * @param chainInfo The chain information
   * @param tokenAddresses The token addresses to get the spot price for
   * @param quoteCurrency The quote currency in which the spot prices will be denominated
   *
   * @returns The formatted spot price URL
   */
  private _formatSpotUrl(params: {
    chainInfo: IChainInfo
    tokenAddresses: IAddress[]
    quoteCurrency?: FiatCurrency
  }): string {
    const chainId = params.chainInfo.chainId
    const tokenAddresses = params.tokenAddresses.map((address) => address.value.toLowerCase())

    /**
     * apiSpotUrl includes the complete path for the spot price endpoint
     * EG <url>/price/v1.1
     * https://portal.1inch.dev/documentation/spot-price/swagger?method=get&path=%2Fv1.1%2F1%2F%7Baddresses%7D
     */

    const currency = params.quoteCurrency ? `?currency=${params.quoteCurrency.toUpperCase()}` : ''

    return `${this._apiUrl}/price/${this._version}/${chainId}/${tokenAddresses.join(',')}${currency}`
  }

  /**
   * Returns the configuration for the oracle provider
   * @returns The oracle provider configuration
   */
  private _getConfig(): {
    config: OracleProviderConfig
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
    const ONE_INCH_API_SPOT_AUTH_HEADER = this.configProvider.getConfigurationItem({
      name: 'ONE_INCH_API_SPOT_AUTH_HEADER',
    })

    if (
      !ONE_INCH_API_SPOT_URL ||
      !ONE_INCH_API_SPOT_KEY ||
      !ONE_INCH_API_SPOT_VERSION ||
      !ONE_INCH_API_SPOT_AUTH_HEADER
    ) {
      console.error(
        JSON.stringify(
          Object.entries({
            ONE_INCH_API_SPOT_URL,
            ONE_INCH_API_SPOT_KEY,
            ONE_INCH_API_SPOT_VERSION,
            ONE_INCH_API_SPOT_AUTH_HEADER,
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
        authHeader: ONE_INCH_API_SPOT_AUTH_HEADER,
      },
    }
  }

  /**
   * @description Tries to parse the error message from 1inch to provide a higher level error type
   * @param errorDescription The error description from 1inch
   * @returns The parsed error type
   */
  private _parseErrorType(errorDescription: unknown): SwapErrorType {
    console.log(errorDescription)
    if (
      typeof errorDescription === 'string' &&
      errorDescription.toLowerCase().includes('insufficient liquidity')
    ) {
      return SwapErrorType.NoLiquidity
    } else {
      return SwapErrorType.Unknown
    }
  }
}
