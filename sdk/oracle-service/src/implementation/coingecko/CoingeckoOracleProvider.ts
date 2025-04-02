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
  ChainIds,
  LoggingService,
} from '@summerfi/sdk-common'
import { OracleProviderType } from '@summerfi/sdk-common/oracle'
import { ManagerProviderBase } from '@summerfi/sdk-server-common'
import fetch from 'node-fetch'
import type { OracleProviderConfig } from '../Types'
import { BigNumber } from 'bignumber.js'

export type CoingeckoResponse = {
  [address: string]: {
    [currency: string]: number
  }
}

/**
 * @name CoingeckoOracleProvider
 * @description This class is responsible for fetching spot prices from the Coingecko API
 */
export class CoingeckoOracleProvider
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
    super({ ...params, type: OracleProviderType.Coingecko })

    const { config } = this._getConfig()

    this._apiUrl = config.apiUrl
    this._apiKey = config.apiKey
    this._version = config.version
    this._authHeader = config.authHeader
    const supportedChainIds = params.configProvider.getConfigurationItem({
      name: 'COINGECKO_SUPPORTED_CHAIN_IDS',
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
    const authHeader = this._getAuthHeader()

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
      LoggingService.debug('CoingeckoSpotPriceUrl', spotUrl)

      const response = await fetch(spotUrl, {
        headers: authHeader,
      })

      if (!response.ok) {
        const errorJSON = await response.text()
        const errorType = this._parseErrorType(errorJSON)

        throw Error(
          `Error performing coingecko spot price request: ${JSON.stringify({
            apiQuery: spotUrl,
            statusCode: response.status,
            json: errorJSON,
            subtype: errorType,
          })}`,
        )
      }

      const responseData = (await response.json()) as CoingeckoResponse

      const baseUSDPrice =
        responseData[params.baseToken.address.value.toLowerCase()][
          quoteCurrencySymbol.toLowerCase()
        ]
      const quoteUSDPrice =
        responseData[params.denomination?.address.value.toLowerCase()][
          quoteCurrencySymbol.toLowerCase()
        ]
      if (!baseUSDPrice || !quoteUSDPrice) {
        throw new Error('BaseToken | QuoteToken spot prices could not be determined')
      }

      const value = BigNumber(baseUSDPrice).div(quoteUSDPrice).toString()

      return {
        provider: OracleProviderType.Coingecko,
        token: baseToken,
        price: Price.createFrom({
          value,
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
          `Error performing coingecko spot price request: ${JSON.stringify({
            apiQuery: spotUrl,
            statusCode: response.status,
            json: errorJSON,
            subtype: errorType,
          })}`,
        )
      }

      const responseData = (await response.json()) as CoingeckoResponse

      const [, price] = Object.entries(responseData)[0]

      if (!price) {
        throw Error('BaseToken spot price could not be determined')
      }

      return {
        provider: OracleProviderType.Coingecko,
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
    const authHeader = this._getAuthHeader()
    const quote = params.quoteCurrency ?? FiatCurrency.USD

    const spotUrl = this._formatSpotUrl({
      chainInfo: params.chainInfo,
      tokenAddresses: params.baseTokens.map((token) => token.address),
      quoteCurrency: params.quoteCurrency,
    })

    const response = await fetch(spotUrl, {
      headers: authHeader,
    })

    if (!response.ok) {
      const errorJSON = await response.text()
      const errorType = this._parseErrorType(errorJSON)

      throw Error(
        `Error performing coingecko spot price request: ${JSON.stringify({
          apiQuery: spotUrl,
          statusCode: response.status,
          json: errorJSON,
          subtype: errorType,
        })}`,
      )
    }

    const responseData = (await response.json()) as CoingeckoResponse

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
        return [
          address.toLowerCase(),
          Price.createFrom({
            value: price[quote.toLowerCase()].toString(),
            base,
            quote,
          }),
        ]
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
  private _getAuthHeader() {
    return {
      [this._authHeader]: `${this._apiKey}`,
      'Content-Type': 'application/json',
    }
  }

  /**
   * Formats the spot price URL
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
    const platform = this._getPlatform(chainId)

    /**
     * apiSpotUrl includes the complete path for the spot price endpoint
     * EG <url>/price/v1.1
     * https://portal.1inch.dev/documentation/spot-price/swagger?method=get&path=%2Fv1.1%2F1%2F%7Baddresses%7D
     */

    const currency = params.quoteCurrency
      ? `&vs_currencies=${params.quoteCurrency.toLowerCase()}`
      : ''
    const precision = `&precision=6`

    return `${this._apiUrl}/${this._version}/simple/token_price/${platform}?contract_addresses=${tokenAddresses.join(',')}${currency}${precision}`
  }

  /**
   * Returns the configuration for the oracle provider
   * @returns The oracle provider configuration
   */
  private _getConfig(): {
    config: OracleProviderConfig
  } {
    const COINGECKO_API_URL = this.configProvider.getConfigurationItem({
      name: 'COINGECKO_API_URL',
    })
    const COINGECKO_API_VERSION = this.configProvider.getConfigurationItem({
      name: 'COINGECKO_API_VERSION',
    })
    const COINGECKO_API_KEY = this.configProvider.getConfigurationItem({
      name: 'COINGECKO_API_KEY',
    })
    const COINGECKO_API_AUTH_HEADER = this.configProvider.getConfigurationItem({
      name: 'COINGECKO_API_AUTH_HEADER',
    })

    if (
      !COINGECKO_API_URL ||
      !COINGECKO_API_KEY ||
      !COINGECKO_API_VERSION ||
      !COINGECKO_API_AUTH_HEADER
    ) {
      console.error(
        JSON.stringify(
          Object.entries({
            COINGECKO_API_URL,
            COINGECKO_API_KEY,
            COINGECKO_API_VERSION,
            COINGECKO_API_AUTH_HEADER,
          }),
          null,
          2,
        ),
      )
      throw new Error('Coingecko configuration is missing, check logs for more information')
    }

    return {
      config: {
        apiUrl: COINGECKO_API_URL,
        apiKey: COINGECKO_API_KEY,
        version: COINGECKO_API_VERSION,
        authHeader: COINGECKO_API_AUTH_HEADER,
      },
    }
  }

  private _getPlatform(chainId: ChainId) {
    switch (chainId) {
      case ChainIds.Mainnet:
        return 'ethereum'
      case ChainIds.ArbitrumOne:
        return 'arbitrum-one'
      case ChainIds.Base:
        return 'base'
      case ChainIds.Sonic:
        return 'sonic'
      default:
        throw new Error(`Unsupported chainId: ${chainId}`)
    }
  }

  /**
   * @description Tries to parse the error message from 1inch to provide a higher level error type
   * @param errorDescription The error description from 1inch
   * @returns The parsed error type
   */
  private _parseErrorType(errorDescription: unknown): SwapErrorType {
    console.error(errorDescription)
    return SwapErrorType.Unknown
  }
}
