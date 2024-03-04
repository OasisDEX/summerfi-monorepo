import { ISwapProvider } from '@summerfi/swap-common/interfaces'
import { SwapProviderType } from '@summerfi/swap-common/enums'
import { SwapData } from '@summerfi/swap-common/types'
import {
  OneInchAuthHeader,
  OneInchAuthHeaderKey,
  OneInchSwapProviderConfig,
  OneInchSwapResponse,
} from './types'
import { HexData } from '@summerfi/sdk-common/common/aliases'
import fetch from 'node-fetch'
import {
  type ChainInfo,
  TokenAmount,
  type Percentage,
  type Token,
  Address,
} from '@summerfi/sdk-common/common'

export class OneInchSwapProvider implements ISwapProvider {
  public type: SwapProviderType = SwapProviderType.OneInch

  private readonly _apiUrl: string
  private readonly _version: string
  private readonly _allowedSwapProtocols: string[]
  private readonly _apiKey: string

  constructor(params: OneInchSwapProviderConfig) {
    this._apiUrl = params.apiUrl
    this._version = params.version
    this._apiKey = params.apiKey
    this._allowedSwapProtocols = params.allowedSwapProtocols
  }

  public async getSwapData(params: {
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
      throw new Error(`Error performing 1inch swap request ${swapUrl}: ${await response.body}`)
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
      targetContract: Address.createFrom({ value: responseData.tx.to as HexData }),
      value: responseData.tx.value,
      gasPrice: responseData.tx.gasPrice,
    }
  }

  private _getOneInchAuthHeader(): OneInchAuthHeader {
    return { [OneInchAuthHeaderKey]: this._apiKey }
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
    const fromTokenAddress = params.fromTokenAmount.token.address.toString().toLowerCase()
    const toTokenAddress = params.toToken.address.toString().toLowerCase()
    const fromAmount = params.fromTokenAmount.toBaseUnit()
    const recipient = params.recipient.toString()
    const disableEstimate = params.disableEstimate ? params.disableEstimate : true
    const allowPartialFill = params.allowPartialFill ? params.allowPartialFill : false
    const protocolsParam = this._allowedSwapProtocols.length
      ? this._allowedSwapProtocols.join(',')
      : ''

    return `${this._apiUrl}/${this._version}/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${fromAmount}&fromAddress=${recipient}&slippage=${params.slippage.toString()}&protocols=${protocolsParam}&disableEstimate=${disableEstimate}&allowPartialFill=${allowPartialFill}`
  }
}
