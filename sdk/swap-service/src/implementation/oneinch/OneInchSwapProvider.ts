import { ISwapProvider } from '@summerfi/swap-common/interfaces'
import {
  SwapProviderType,
  SwapData,
  SpotData,
  SwapRoute,
  QuoteData,
} from '@summerfi/sdk-common/swap'
import {
  OneInchAuthHeader,
  OneInchAuthHeaderKey,
  OneInchQuoteResponse,
  OneInchSpotResponse,
  OneInchSwapProviderConfig,
  OneInchSwapResponse,
  OneInchSwapRoute,
} from './types'
import { HexData } from '@summerfi/sdk-common/common/aliases'
import fetch from 'node-fetch'
import {
  type ChainInfo,
  TokenAmount,
  Percentage,
  Token,
  Address,
  CurrencySymbol,
  Price,
  type AddressValue,
} from '@summerfi/sdk-common/common'

export class OneInchSwapProvider implements ISwapProvider {
  public type: SwapProviderType = SwapProviderType.OneInch

  /**
   * =============== WARNING ===============
   * We require 1inch's new Spot Prices endpoint (not available on 1inch.io)
   * Once we move everything to 1inch's latest API we can consolidate urls & keys
   *
   * DO NOT add new url's or key's when modifying this class.
   * Try to consolidate
   *
   * Once we've tested Swap data with DMA & the latest API
   * https://portal.1inch.dev/documentation/swap/swagger?method=get&path=%2Fv6.0%2F1%2Fswap
   * */
  private readonly _apiUrl: string
  private readonly _apiKey: string
  private readonly _version: string

  private readonly _apiSpotUrl: string
  private readonly _apiSpotKey: string
  private readonly _spotVersion: string

  private readonly _allowedSwapProtocols: string[]

  constructor(params: OneInchSwapProviderConfig) {
    this._apiUrl = params.apiUrl
    this._apiKey = params.apiKey
    this._version = params.version

    this._apiSpotUrl = params.apiSpotUrl
    this._apiSpotKey = params.apiSpotKey
    this._spotVersion = params.spotVersion

    this._allowedSwapProtocols = params.allowedSwapProtocols
  }

  async getSwapDataExactInput(params: {
    chainInfo: ChainInfo
    fromAmount: TokenAmount
    toToken: Token
    recipient: Address
    slippage: Percentage
  }): Promise<SwapData> {
    const swapUrl = this._formatOneInchSwapUrl({
      chainInfo: params.chainInfo,
      fromTokenAmount: params.fromAmount,
      toToken: params.toToken,
      recipient: params.recipient,
      slippage: params.slippage,
    })

    const authHeader = this._getOneInchAuthHeader()

    const response = await fetch(swapUrl, {
      headers: authHeader,
    })

    if (!(response.status === 200 && response.statusText === 'OK')) {
      throw new Error(`Error performing 1inch swap data request ${swapUrl}: ${await response.body}`)
    }

    const responseData = (await response.json()) as OneInchSwapResponse

    return {
      provider: SwapProviderType.OneInch,
      fromTokenAmount: params.fromAmount,
      toTokenAmount: TokenAmount.createFrom({
        token: params.toToken,
        amount: responseData.toTokenAmount,
      }),
      calldata: responseData.tx.data as HexData,
      targetContract: Address.createFromEthereum({ value: responseData.tx.to as HexData }),
      value: responseData.tx.value,
      gasPrice: responseData.tx.gasPrice,
    }
  }

  async getSwapQuoteExactInput(params: {
    chainInfo: ChainInfo
    fromAmount: TokenAmount
    toToken: Token
  }): Promise<QuoteData> {
    const swapUrl = this._formatOneInchQuoteUrl({
      chainInfo: params.chainInfo,
      fromTokenAmount: params.fromAmount,
      toToken: params.toToken,
    })

    const authHeader = this._getOneInchAuthHeader()

    const response = await fetch(swapUrl, {
      headers: authHeader,
    })

    if (!(response.status === 200 && response.statusText === 'OK')) {
      throw new Error(
        `Error [${response.statusText}] performing 1inch swap quote request ${swapUrl}: ${JSON.stringify(await response.body)}`,
      )
    }

    const responseData = (await response.json()) as OneInchQuoteResponse

    return {
      provider: SwapProviderType.OneInch,
      fromTokenAmount: params.fromAmount,
      toTokenAmount: TokenAmount.createFrom({
        token: params.toToken,
        amount: responseData.toTokenAmount,
      }),
      routes: this._extractSwapRoutes(responseData.protocols),
      estimatedGas: responseData.estimatedGas,
    }
  }

  async getSpotPrice(params: {
    chainInfo: ChainInfo
    baseToken: Token
    quoteToken?: CurrencySymbol | Token
  }): Promise<SpotData> {
    const authHeader = this._getOneInchSpotAuthHeader()
    if (params.quoteToken && params.quoteToken instanceof Token) {
      isTokenType(params.quoteToken)

      const baseTokenAddress = params.baseToken.address
      const quoteTokenAddress = params.quoteToken.address
      const quoteCurrencySymbol = CurrencySymbol.USD

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
          `Error performing 1inch spot price request ${spotUrl}: ${await response.body}`,
        )
      }

      const responseData = (await response.json()) as OneInchSpotResponse
      const quoteToken = params.quoteToken
      const prices = Object.entries(responseData).map(([address, price]) => {
        const isBaseToken = params.baseToken.address.equals(
          Address.createFromEthereum({ value: address as AddressValue }),
        )
        return Price.createFrom({
          value: price.toString(),
          baseToken: isBaseToken ? params.baseToken : quoteToken,
          quoteToken: quoteCurrencySymbol,
        })
      })

      const baseTokenPriceQuotedInCurrencySymbol = prices.find((p) =>
        p.baseToken.address.equals(params.baseToken.address),
      )
      const quoteTokenPriceQuoteInCurrencySymbol = prices.find((p) =>
        p.baseToken.address.equals(quoteToken.address),
      )

      if (!baseTokenPriceQuotedInCurrencySymbol || !quoteTokenPriceQuoteInCurrencySymbol) {
        throw new Error('BaseToken | QuoteToken spot prices could not be determined')
      }

      return {
        provider: SwapProviderType.OneInch,
        price: Price.createFrom({
          value: baseTokenPriceQuotedInCurrencySymbol
            .toBN()
            .div(quoteTokenPriceQuoteInCurrencySymbol.toBN())
            .toString(),
          baseToken: params.baseToken,
          quoteToken: quoteToken,
        }),
      }
    } else {
      const quoteCurrency = params.quoteToken ?? CurrencySymbol.USD
      const spotUrl = this._formatOneInchSpotUrl({
        chainInfo: params.chainInfo,
        tokenAddresses: [params.baseToken.address],
        quoteCurrency: params.quoteToken ?? CurrencySymbol.USD,
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
        provider: SwapProviderType.OneInch,
        price: Price.createFrom({
          value: price.toString(),
          baseToken: params.baseToken,
          quoteToken: quoteCurrency,
        }),
      }
    }
  }

  private _getOneInchAuthHeader(): OneInchAuthHeader {
    return { [OneInchAuthHeaderKey]: this._apiKey }
  }

  private _getOneInchSpotAuthHeader(): OneInchAuthHeader {
    return { [OneInchAuthHeaderKey]: this._apiSpotKey }
  }

  private _formatOneInchSwapUrl(params: {
    chainInfo: ChainInfo
    fromTokenAmount: TokenAmount
    toToken: Token
    recipient: Address
    slippage: Percentage
    disableEstimate?: boolean
    allowPartialFill?: boolean
  }): string {
    const chainId = params.chainInfo.chainId
    const fromTokenAddress = params.fromTokenAmount.token.address.value.toLowerCase()
    const toTokenAddress = params.toToken.address.value.toLowerCase()
    const fromAmount = params.fromTokenAmount.toBaseUnit()
    const recipient = params.recipient.value.toLowerCase()
    const disableEstimate = params.disableEstimate ? params.disableEstimate : true
    const allowPartialFill = params.allowPartialFill ? params.allowPartialFill : false
    const protocolsParam = this._allowedSwapProtocols.length
      ? this._allowedSwapProtocols.join(',')
      : ''

    return `${this._apiUrl}/${this._version}/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${fromAmount}&fromAddress=${recipient}&slippage=${params.slippage.toString()}&protocols=${protocolsParam}&disableEstimate=${disableEstimate}&allowPartialFill=${allowPartialFill}`
  }

  private _formatOneInchQuoteUrl(params: {
    chainInfo: ChainInfo
    fromTokenAmount: TokenAmount
    toToken: Token
  }): string {
    const chainId = params.chainInfo.chainId
    const fromTokenAddress = params.fromTokenAmount.token.address.value.toLowerCase()
    const toTokenAddress = params.toToken.address.value.toLowerCase()
    const fromAmount = params.fromTokenAmount.toBaseUnit()
    const protocolsParam = this._allowedSwapProtocols.length
      ? this._allowedSwapProtocols.join(',')
      : ''

    return `${this._apiUrl}/${this._version}/${chainId}/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${fromAmount}&protocols=${protocolsParam}`
  }

  private _formatOneInchSpotUrl(params: {
    chainInfo: ChainInfo
    tokenAddresses: Address[]
    quoteCurrency: CurrencySymbol
  }): string {
    const chainId = params.chainInfo.chainId
    const tokenAddresses = params.tokenAddresses.map((address) => address.value.toLowerCase())

    /**
     * apiSpotUrl includes the complete path for the spot price endpoint
     * EG <url>/price/v1.1
     * https://portal.1inch.dev/documentation/spot-price/swagger?method=get&path=%2Fv1.1%2F1%2F%7Baddresses%7D
     */
    return `${this._apiSpotUrl}/price/${this._spotVersion}/${chainId}/${tokenAddresses.join(',')}?currency=${params.quoteCurrency.toUpperCase()}`
  }

  private _extractSwapRoutes(protocols: OneInchSwapRoute[]): SwapRoute[] {
    return protocols.map((route) =>
      route.map((hop) =>
        hop.map((hopPart) => ({
          name: hopPart.name,
          part: Percentage.createFrom({ value: hopPart.part }),
          fromTokenAddress: Address.createFromEthereum({
            value: hopPart.fromTokenAddress as HexData,
          }),
          toTokenAddress: Address.createFromEthereum({ value: hopPart.toTokenAddress as HexData }),
        })),
      ),
    )
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
