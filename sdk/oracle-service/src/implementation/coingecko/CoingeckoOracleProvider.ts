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
  OracleProviderType,
  isChainId,
  createTimeoutSignal,
  NATIVE_CURRENCY_ADDRESS_LOWERCASE,
} from '@summerfi/sdk-common'
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
  private readonly _defaultPrecision = '6'
  private readonly _defaultCurrency = 'usd'

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
    this._supportedChainIds = supportedChainIds
      .split(',')
      .map((id) => parseInt(id))
      .filter(isChainId)
  }

  /** @see IOracleProvider.getSupportedChainIds */
  getSupportedChainIds(): ChainId[] {
    return this._supportedChainIds
  }

  /** @see IOracleProvider.getSpotPrice */
  async getSpotPrice(
    params: Parameters<IOracleProvider['getSpotPrice']>[0],
  ): ReturnType<IOracleProvider['getSpotPrice']> {
    if (params.denomination && isToken(params.denomination)) {
      const baseToken = params.baseToken
      const quoteToken = params.denomination
      const quoteCurrencySymbol = FiatCurrency.USD

      const responseData = await this._fetchCoingeckoPrice({
        chainInfo: params.baseToken.chainInfo,
        tokenAddresses: [baseToken.address, quoteToken.address],
        // We use USD as base for both tokens and then derive a spot price
        quoteCurrency: quoteCurrencySymbol,
        debugContext: {
          method: 'getSpotPrice - token denomination',
          chainId: params.baseToken.chainInfo.chainId,
          baseToken: params.baseToken.toString(),
          denomination: params.denomination?.toString(),
        },
      })

      const baseUSDPrice =
        responseData[params.baseToken.address.value.toLowerCase()][
          quoteCurrencySymbol.toLowerCase()
        ]
      const quoteUSDPrice =
        responseData[params.denomination?.address.value.toLowerCase()][
          quoteCurrencySymbol.toLowerCase()
        ]
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

      const responseData = await this._fetchCoingeckoPrice({
        chainInfo: params.baseToken.chainInfo,
        tokenAddresses: [baseToken.address],
        quoteCurrency: quoteCurrency,
        debugContext: {
          method: 'getSpotPrice - Fiat denomination',
          chainId: params.baseToken.chainInfo.chainId,
          baseToken: params.baseToken.toString(),
          denomination: quoteCurrency,
        },
      })

      const [, price] = Object.entries(responseData)[0]

      const priceValue = price['usd'] ?? price[quoteCurrency.toLowerCase()] ?? price

      if (!price) {
        throw Error('BaseToken spot price could not be determined')
      }

      return {
        provider: OracleProviderType.Coingecko,
        token: baseToken,
        price: Price.createFrom({
          value: priceValue.toString(),
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
    const quote = params.quoteCurrency ?? FiatCurrency.USD

    const responseData = await this._fetchCoingeckoPrice({
      chainInfo: params.chainInfo,
      tokenAddresses: params.baseTokens.map((token) => token.address),
      quoteCurrency: params.quoteCurrency,
      debugContext: {
        method: 'getSpotPrices',
        baseTokens: params.baseTokens.map((token) => token.toString()),
        quoteCurrency: quote,
      },
    })

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
   * Fetches price data from Coingecko API with error handling
   * @param chainInfo The chain information
   * @param tokenAddresses The token addresses to get the spot price for
   * @param quoteCurrency The quote currency in which the spot prices will be denominated
   * @param debugContext Context information for logging
   * @returns The parsed JSON response
   */
  private async _fetchCoingeckoPrice(params: {
    chainInfo: IChainInfo
    tokenAddresses: IAddress[]
    quoteCurrency?: FiatCurrency
    debugContext: Record<string, unknown>
  }): Promise<CoingeckoResponse> {
    const authHeader = this._getAuthHeader()

    // split tokenAddresses in two parts, tokens and native coins, check for a 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE address to identify native coins
    const nativeCoins = params.tokenAddresses.filter(
      (address) => address.value.toLowerCase() === NATIVE_CURRENCY_ADDRESS_LOWERCASE,
    )
    const tokens = params.tokenAddresses.filter(
      (address) => address.value.toLowerCase() !== NATIVE_CURRENCY_ADDRESS_LOWERCASE,
    )

    const spotCoinsUrl = nativeCoins.length
      ? this._formatTokensUrl({
          chainInfo: params.chainInfo,
          tokenAddresses: nativeCoins,
          quoteCurrency: params.quoteCurrency,
        })
      : null

    const spotUrl = tokens.length
      ? this._formatTokensUrl({
          chainInfo: params.chainInfo,
          tokenAddresses: tokens,
          quoteCurrency: params.quoteCurrency,
        })
      : null

    LoggingService.debug('CoingeckoOracleProvider - fetching price', {
      ...params.debugContext,
      spotUrl,
      spotCoinsUrl,
    })

    const spotRequests = []
    if (spotUrl) {
      spotRequests.push(
        fetch(spotUrl, {
          headers: authHeader,
          signal: createTimeoutSignal(),
        }),
      )
    }
    if (spotCoinsUrl) {
      spotRequests.push(
        fetch(spotCoinsUrl, {
          headers: authHeader,
          signal: createTimeoutSignal(),
        }),
      )
    }
    // Build a parallel array of request URLs so we can tie responses to URLs for error reporting.
    const requestUrls: string[] = []
    if (spotUrl) requestUrls.push(spotUrl)
    if (spotCoinsUrl) requestUrls.push(spotCoinsUrl)

    const responses = await Promise.all(
      requestUrls.map((url) =>
        fetch(url, {
          headers: authHeader,
          signal: createTimeoutSignal(),
        }),
      ),
    )

    // Check each response for errors and parse JSON
    const mergedResult: CoingeckoResponse = {}

    for (let i = 0; i < responses.length; i++) {
      const resp = responses[i]
      const url = requestUrls[i]

      if (!resp.ok) {
        const errorText = await resp.text()
        const errorType = this._parseErrorType(errorText)
        throw Error(
          `Error performing coingecko spot price request: ${JSON.stringify({
            apiQuery: url,
            statusCode: resp.status,
            json: errorText,
            subtype: errorType,
          })}`,
        )
      }

      const json = (await resp.json()) as Record<string, unknown>

      // If this response is from the coin (native) endpoint, map its coin-id keyed entry
      // to the native currency address key so callers expecting address keys keep working.
      if (url === spotCoinsUrl) {
        const coinId = this._getCoingeckoId(params.chainInfo.chainId)
        const coinData = (json as Record<string, unknown>)[coinId]
        if (coinData) {
          mergedResult[NATIVE_CURRENCY_ADDRESS_LOWERCASE] = coinData as {
            [currency: string]: number
          }
        }
      } else {
        // token endpoint returns address -> {currency: value} mapping; merge directly.
        Object.assign(mergedResult, json as CoingeckoResponse)
      }
    }

    return mergedResult
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
  private _formatTokensUrl(params: {
    chainInfo: IChainInfo
    tokenAddresses: IAddress[]
    quoteCurrency?: FiatCurrency
  }): string {
    const chainId = params.chainInfo.chainId
    const tokenAddresses = params.tokenAddresses.map((address) => address.value.toLowerCase())
    const hasNativeToken = tokenAddresses.includes(NATIVE_CURRENCY_ADDRESS_LOWERCASE)

    // If the list contains the native token address, use the coin endpoint
    if (hasNativeToken) {
      return this._formatCoinUrl({ chainId, quoteCurrency: params.quoteCurrency })
    }

    // Otherwise, use the token_price endpoint
    const platform = this._getPlatform(chainId)

    /**
     * apiSpotUrl includes the complete path for the spot price endpoint
     * EG <url>/price/v1.1
     * https://portal.1inch.dev/documentation/spot-price/swagger?method=get&path=%2Fv1.1%2F1%2F%7Baddresses%7D
     */

    const currencyParam = this._formatCurrencyParam(params.quoteCurrency)
    const precisionParam = this._formatPrecisionParam()

    return `${this._apiUrl}/${this._version}/simple/token_price/${platform}?contract_addresses=${tokenAddresses.join(',')}${currencyParam}${precisionParam}`
  }

  /**
   * Formats the coin price URL for native tokens
   * @param chainId The chain ID
   * @param quoteCurrency The quote currency in which the spot prices will be denominated
   *
   * @returns The formatted coin price URL
   */
  private _formatCoinUrl(params: { chainId: ChainId; quoteCurrency?: FiatCurrency }): string {
    const id = this._getCoingeckoId(params.chainId)
    const currencyParam = this._formatCurrencyParam(params.quoteCurrency)
    const precisionParam = this._formatPrecisionParam()

    return `${this._apiUrl}/${this._version}/simple/price?ids=${id}${currencyParam}${precisionParam}`
  }

  /**
   * Formats the currency query parameter
   * @param quoteCurrency The quote currency
   * @returns The formatted currency parameter
   */
  private _formatCurrencyParam(quoteCurrency?: FiatCurrency): string {
    const currency = quoteCurrency?.toLowerCase() ?? this._defaultCurrency
    return `&vs_currencies=${currency}`
  }

  /**
   * Formats the precision query parameter
   * @returns The formatted precision parameter
   */
  private _formatPrecisionParam(): string {
    return `&precision=${this._defaultPrecision}`
  }

  /**
   * Maps chain ID to Coingecko coin ID
   * @param chainId The chain ID
   * @returns The Coingecko coin ID
   */
  private _getCoingeckoId(chainId: ChainId): string {
    switch (chainId) {
      case ChainIds.Mainnet:
        return 'ethereum'
      case ChainIds.ArbitrumOne:
        return 'ethereum'
      case ChainIds.Base:
        return 'ethereum'
      case ChainIds.Sonic:
        return 'sonic-3'
      default:
        throw new Error(`Unsupported chainId for native token: ${chainId}`)
    }
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
