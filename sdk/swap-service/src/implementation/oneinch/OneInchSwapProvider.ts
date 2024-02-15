import { Address, Percentage, TokenAmount } from '@summerfi/sdk-common/common'
import { SwapData, ISwapProvider, SwapProviderType } from '~swap-service/interfaces'
import { ChainInfo } from '@summerfi/sdk-common/chains'
import {
  OneInchAuthHeader,
  OneInchAuthHeaderKey,
  OneInchSwapProviderConfig,
  OneInchSwapResponse,
} from './types'
import { Hex } from 'viem'
import fetch from 'node-fetch'

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
    toMinimumAmount: TokenAmount
    recipient: Address
    slippage: Percentage
  }): Promise<SwapData> {
    const swapUrl = this._formatOneInchSwapUrl({
      chainInfo: params.chainInfo,
      fromTokenAmount: params.fromAmount,
      toMinimumAmount: params.toMinimumAmount,
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
      toTokenAmount: params.toMinimumAmount,
      calldata: responseData.tx.data as Hex,
      targetContract: Address.createFrom({ hexValue: responseData.tx.to }),
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
    toMinimumAmount: TokenAmount
    recipient: Address
    slippage: Percentage
    disableEstimate?: boolean
    allowPartialFill?: boolean
  }): string {
    const chainId = params.chainInfo.chainId
    const fromTokenAddress = params.fromTokenAmount.token.address.toString().toLowerCase()
    const toTokenAddress = params.toMinimumAmount.token.address.toString().toLowerCase()
    const fromAmount = params.fromTokenAmount.toWei()
    const recipient = params.recipient.toString()
    const disableEstimate = params.disableEstimate ? params.disableEstimate : true
    const allowPartialFill = params.allowPartialFill ? params.allowPartialFill : false
    const protocolsParam = this._allowedSwapProtocols.length
      ? this._allowedSwapProtocols.join(',')
      : ''

    return `${this._apiUrl}/${this._version}/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${fromAmount}&fromAddress=${recipient}&slippage=${params.slippage.toString()}&protocols=${protocolsParam}&disableEstimate=${disableEstimate}&allowPartialFill=${allowPartialFill}`
  }
}
