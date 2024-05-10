import { ISwapProvider } from '@summerfi/swap-common/interfaces'
import { SwapProviderType, SwapData, SwapRoute, QuoteData } from '@summerfi/sdk-common/swap'
import {
  OneInchAuthHeader,
  OneInchAuthHeaderKey,
  OneInchQuoteResponse,
  OneInchSwapProviderConfig,
  OneInchSwapResponse,
  OneInchSwapRoute,
} from './types'
import { HexData } from '@summerfi/sdk-common/common/aliases'
import fetch from 'node-fetch'
import {
  TokenAmount,
  Percentage,
  Address,
  ITokenAmount,
  IToken,
  IAddress,
  IPercentage,
  IChainInfo,
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

  private readonly _allowedSwapProtocols: string[]

  constructor(params: OneInchSwapProviderConfig) {
    this._apiUrl = params.apiUrl
    this._apiKey = params.apiKey
    this._version = params.version

    this._allowedSwapProtocols = params.allowedSwapProtocols
  }

  async getSwapDataExactInput(params: {
    chainInfo: IChainInfo
    fromAmount: ITokenAmount
    toToken: IToken
    recipient: IAddress
    slippage: IPercentage
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
      toTokenAmount: TokenAmount.createFromBaseUnit({
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
    chainInfo: IChainInfo
    fromAmount: ITokenAmount
    toToken: IToken
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
        `Error [${response.statusText}] performing 1inch swap quote request ${swapUrl}`,
      )
    }

    const responseData = (await response.json()) as OneInchQuoteResponse

    return {
      provider: SwapProviderType.OneInch,
      fromTokenAmount: params.fromAmount,
      toTokenAmount: TokenAmount.createFromBaseUnit({
        token: params.toToken,
        amount: responseData.toTokenAmount,
      }),
      routes: this._extractSwapRoutes(responseData.protocols),
      estimatedGas: responseData.estimatedGas,
    }
  }

  private _getOneInchAuthHeader(): OneInchAuthHeader {
    return { [OneInchAuthHeaderKey]: this._apiKey }
  }

  private _formatOneInchSwapUrl(params: {
    chainInfo: IChainInfo
    fromTokenAmount: ITokenAmount
    toToken: IToken
    recipient: IAddress
    slippage: IPercentage
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
    chainInfo: IChainInfo
    fromTokenAmount: ITokenAmount
    toToken: IToken
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
