import { Address, Percentage, TokenAmount } from '@summerfi/sdk/common'
import { SwapManager } from '~swap-manager'
import { SwapData, SwapProvider } from '~swap-manager/interfaces/SwapManager'
import { AuthHeader, AuthHeaderKey } from './types'
import { ChainInfo } from '@summerfi/sdk/chains'
import axios from 'axios'

export class OneInchSwapManager implements SwapManager {
  private readonly _OneInchApiURL = 'https://api-oasis.1inch.io'
  private readonly _OneInchVersion = 'v4.0'
  private readonly _AllowedSwapProtocols = [
    'UNISWAP_V3',
    'PMM1',
    'PMM2',
    'PMM3',
    'PMM4',
    'UNISWAP_V2',
    'SUSHI',
    'CURVE',
    'CURVE_V2',
    'PSM',
    'WSTETH',
    'BALANCER',
    'BALANCER_V2',
    'BALANCER_V2_WRAPPER',
    'ST_ETH',
    'WETH',
    'ROCKET_POOL',
  ]

  private readonly _apiKey: string

  constructor() {
    if (!process.env.ONE_INCH_API_KEY) {
      throw new Error('ONE_INCH_API_KEY is not defined')
    }
    this._apiKey = process.env.ONE_INCH_API_KEY
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

    const response = await axios.get(swapUrl, {
      headers: authHeader,
    })

    if (!(response.status === 200 && response.statusText === 'OK')) {
      throw new Error(`Error performing 1inch swap request ${swapUrl}: ${await response.data}`)
    }

    return {
      provider: SwapProvider.OneInch,
      fromTokenAmount: params.fromAmount,
      toTokenAmount: params.toMinimumAmount,
      calldata: response.data.tx.data,
      targetContract: Address.createFrom({ hexValue: response.data.tx.to }),
      value: response.data.tx.value,
      gasPrice: response.data.tx.gasPrice,
    }
  }

  private _getOneInchAuthHeader(): AuthHeader {
    return { [AuthHeaderKey]: this._apiKey }
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
    const protocolsParam = this._AllowedSwapProtocols.length
      ? this._AllowedSwapProtocols.join(',')
      : ''

    return `${this._OneInchApiURL}/${this._OneInchVersion}/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${fromAmount}&fromAddress=${recipient}&slippage=${params.slippage.toString()}&protocols=${protocolsParam}&disableEstimate=${disableEstimate}&allowPartialFill=${allowPartialFill}`
  }
}
