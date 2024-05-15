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
import { ChainId, HexData } from '@summerfi/sdk-common/common/aliases'
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
import { ManagerProviderBase } from '@summerfi/sdk-server-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider'

export class OneInchSwapProvider
  extends ManagerProviderBase<SwapProviderType>
  implements ISwapProvider
{
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
  private readonly _supportedChainIds: ChainId[]

  /** CONSTRUCTOR */

  constructor(params: { configProvider: IConfigurationProvider }) {
    super({ ...params, type: SwapProviderType.OneInch })

    const { config, chainIds } = this._getConfig()

    this._apiUrl = config.apiUrl
    this._apiKey = config.apiKey
    this._version = config.version

    this._allowedSwapProtocols = config.allowedSwapProtocols
    this._supportedChainIds = chainIds
  }

  /** PUBLIC */

  /** @see ISwapProvider.getSwapDataExactInput */
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

  /** @see ISwapProvider.getSwapQuoteExactInput */
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

  /** @see IManagerProvider.getSupportedChainIds */
  getSupportedChainIds(): ChainId[] {
    return this._supportedChainIds
  }

  /** PRIVATE */

  /**
   * @description Returns the OneInch auth header with the API key
   * @returns The OneInch auth header
   */
  private _getOneInchAuthHeader(): OneInchAuthHeader {
    return { [OneInchAuthHeaderKey]: this._apiKey }
  }

  /**
   * @description Formats the 1inch swap URL
   * @param chainInfo The chain information
   * @param fromTokenAmount The amount of tokens to swap
   * @param toToken The token to swap to
   * @param recipient The address that will receive the tokens
   * @param slippage The maximum slippage allowed
   * @param disableEstimate Whether to disable the estimate
   * @param allowPartialFill Whether to allow partial fill of the order
   *
   * @returns The formatted 1inch swap URL
   */
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

  /**
   * Formats the 1inch quote URL
   * @param chainInfo The chain information
   * @param fromTokenAmount The amount of tokens to swap
   * @param toToken The token to swap to
   *
   * @returns The formatted 1inch quote URL
   */
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

  /**
   * Extracts the swap routes from the 1inch response
   * @param protocols The 1inch swap routes
   *
   * @returns The extracted swap routes
   */
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

  /**
   * Gets the 1inch configuration from the configuration provider
   * @returns The 1inch configuration
   */
  private _getConfig(): {
    config: OneInchSwapProviderConfig
    chainIds: ChainId[]
  } {
    const ONE_INCH_API_URL = this.configProvider.getConfigurationItem({ name: 'ONE_INCH_API_URL' })
    const ONE_INCH_API_KEY = this.configProvider.getConfigurationItem({ name: 'ONE_INCH_API_KEY' })
    const ONE_INCH_API_VERSION = this.configProvider.getConfigurationItem({
      name: 'ONE_INCH_API_VERSION',
    })
    const ONE_INCH_ALLOWED_SWAP_PROTOCOLS = this.configProvider.getConfigurationItem({
      name: 'ONE_INCH_ALLOWED_SWAP_PROTOCOLS',
    })
    const ONE_INCH_SWAP_CHAIN_IDS = this.configProvider.getConfigurationItem({
      name: 'ONE_INCH_SWAP_CHAIN_IDS',
    })

    if (
      !ONE_INCH_API_URL ||
      !ONE_INCH_API_KEY ||
      !ONE_INCH_API_VERSION ||
      !ONE_INCH_ALLOWED_SWAP_PROTOCOLS ||
      !ONE_INCH_SWAP_CHAIN_IDS
    ) {
      throw new Error(
        'OneInch configuration is missing: ' +
          JSON.stringify(
            Object.entries({
              ONE_INCH_API_URL,
              ONE_INCH_API_KEY,
              ONE_INCH_API_VERSION,
              ONE_INCH_ALLOWED_SWAP_PROTOCOLS,
              ONE_INCH_SWAP_CHAIN_IDS,
            }),
            null,
            2,
          ),
      )
    }

    return {
      config: {
        apiUrl: ONE_INCH_API_URL,
        apiKey: ONE_INCH_API_KEY,
        version: ONE_INCH_API_VERSION,
        allowedSwapProtocols: ONE_INCH_ALLOWED_SWAP_PROTOCOLS.split(','),
      },
      chainIds: ONE_INCH_SWAP_CHAIN_IDS.split(',').map((id: string) => parseInt(id)),
    }
  }
}
