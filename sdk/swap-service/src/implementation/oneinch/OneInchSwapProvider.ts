import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import {
  Address,
  IAddress,
  IChainInfo,
  IPercentage,
  IToken,
  ITokenAmount,
  Percentage,
  TokenAmount,
  ChainId,
  HexData,
  QuoteData,
  SwapData,
  SwapErrorType,
  SwapProviderType,
  SwapRoute,
  LoggingService,
  isChainId,
} from '@summerfi/sdk-common'
import { ManagerProviderBase } from '@summerfi/sdk-server-common'
import { type ISwapProvider } from '@summerfi/swap-common'
import fetch from 'node-fetch'
import {
  OneInchAuthHeader,
  OneInchAuthHeaderKey,
  OneInchQuoteResponse,
  OneInchSwapProviderConfig,
  OneInchSwapResponse,
  OneInchSwapRoute,
} from './types'

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
  private readonly _excludedSwapProtocols: string[]
  private readonly _supportedChainIds: ChainId[]

  /** CONSTRUCTOR */

  constructor(params: { configProvider: IConfigurationProvider }) {
    super({ ...params, type: SwapProviderType.OneInch })

    const { config, chainIds } = this._getConfig()

    this._apiUrl = config.apiUrl
    this._apiKey = config.apiKey
    this._version = config.version

    this._allowedSwapProtocols = config.allowedSwapProtocols
    this._excludedSwapProtocols = config.excludedSwapProtocols
    this._supportedChainIds = chainIds
  }

  /** PUBLIC */

  /** @see ISwapProvider.getSwapDataExactInput */
  async getSwapDataExactInput(params: {
    fromAmount: ITokenAmount
    toToken: IToken
    recipient: IAddress
    slippage: IPercentage
  }): Promise<SwapData> {
    const swapUrl = this._formatOneInchSwapUrl({
      chainInfo: params.fromAmount.token.chainInfo,
      fromTokenAmount: params.fromAmount,
      toToken: params.toToken,
      recipient: params.recipient,
      slippage: params.slippage,
    })

    LoggingService.debug('OneInchSwapQuoteProvider.getSwapDataExactInput', {
      fromTokenAmount: params.fromAmount,
      toToken: params.toToken,
      swapUrl,
    })

    const authHeader = this._getOneInchAuthHeader()

    const response = await fetch(swapUrl, {
      headers: authHeader,
    })

    if (!response.ok) {
      const errorJSON = await response.json()
      const errorType = this._parseErrorType(errorJSON?.description)

      throw Error(
        `Error performing 1inch swap data request: ${JSON.stringify({
          apiQuery: swapUrl,
          statusCode: response.status,
          json: errorJSON,
          subtype: errorType,
        })}`,
      )
    }

    const responseData = (await response.json()) as OneInchSwapResponse

    return {
      provider: SwapProviderType.OneInch,
      fromTokenAmount: params.fromAmount,
      toTokenAmount: TokenAmount.createFromBaseUnit({
        token: params.toToken,
        amount: responseData.toTokenAmount || responseData.dstAmount,
      }),
      calldata: responseData.tx.data as HexData,
      targetContract: Address.createFromEthereum({ value: responseData.tx.to as HexData }),
      value: responseData.tx.value,
      gasPrice: responseData.tx.gasPrice,
    }
  }

  /** @see ISwapProvider.getSwapQuoteExactInput */
  async getSwapQuoteExactInput(params: {
    fromAmount: ITokenAmount
    toToken: IToken
  }): Promise<QuoteData> {
    const swapUrl = this._formatOneInchQuoteUrl({
      chainInfo: params.fromAmount.token.chainInfo,
      fromTokenAmount: params.fromAmount,
      toToken: params.toToken,
    })
    LoggingService.debug('OneInchSwapQuoteProvider.getSwapExactInput', {
      fromTokenAmount: params.fromAmount,
      toToken: params.toToken,
      swapUrl,
    })

    const authHeader = this._getOneInchAuthHeader()

    const response = await fetch(swapUrl, {
      headers: authHeader,
    })

    if (!response.ok) {
      const errorJSON = await response.json()
      const errorType = this._parseErrorType(errorJSON?.description)

      throw Error(
        `Error performing 1inch swap quote request: ${JSON.stringify({
          apiQuery: swapUrl,
          statusCode: response.status,
          json: errorJSON,
          subtype: errorType,
        })}`,
      )
    }

    const responseData = (await response.json()) as OneInchQuoteResponse

    return {
      provider: SwapProviderType.OneInch,
      fromTokenAmount: params.fromAmount,
      toTokenAmount: TokenAmount.createFromBaseUnit({
        token: params.toToken,
        amount: responseData.toTokenAmount || responseData.dstAmount,
      }),
      routes: this._extractSwapRoutes(responseData.protocols ?? []),
      estimatedGas: responseData.gas?.toString() || '0',
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
    return { [OneInchAuthHeaderKey]: `Bearer ${this._apiKey}` }
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
    const fromAmount = params.fromTokenAmount.toSolidityValue()
    const recipient = params.recipient.value.toLowerCase()
    const disableEstimate = params.disableEstimate ? params.disableEstimate : true
    const allowPartialFill = params.allowPartialFill ? params.allowPartialFill : false
    const protocolsParam =
      this._allowedSwapProtocols.length > 0
        ? '&protocols=' + this._allowedSwapProtocols.join(',')
        : ''
    const excludedProtocolsParam =
      this._excludedSwapProtocols.length > 0
        ? '&excludedProtocols=' + this._excludedSwapProtocols.join(',')
        : ''
    const excludeProtocolsParam =
      this._excludedSwapProtocols.length > 0
        ? '&excludeProtocols=' + this._excludedSwapProtocols.join(',')
        : ''

    return `${this._apiUrl}/swap/${this._version}/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${fromAmount}&fromAddress=${recipient}&slippage=${params.slippage.value}&disableEstimate=${disableEstimate}&allowPartialFill=${allowPartialFill}${protocolsParam}${excludedProtocolsParam}${excludeProtocolsParam}`
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
    const fromAmount = params.fromTokenAmount.toSolidityValue()
    const protocolsParam =
      this._allowedSwapProtocols.length > 0
        ? '&protocols=' + this._allowedSwapProtocols.join(',')
        : ''
    const excludedProtocolsParam =
      this._excludedSwapProtocols.length > 0
        ? '&excludedProtocols=' + this._excludedSwapProtocols.join(',')
        : ''

    return `${this._apiUrl}/swap/${this._version}/${chainId}/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${fromAmount}${protocolsParam}${excludedProtocolsParam}&includeProtocols=true&includeGas=true`
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
    const ONE_INCH_EXCLUDED_SWAP_PROTOCOLS = this.configProvider.getConfigurationItem({
      name: 'ONE_INCH_EXCLUDED_SWAP_PROTOCOLS',
    })
    const ONE_INCH_SWAP_CHAIN_IDS = this.configProvider.getConfigurationItem({
      name: 'ONE_INCH_SWAP_CHAIN_IDS',
    })

    if (
      !ONE_INCH_API_URL ||
      !ONE_INCH_API_KEY ||
      !ONE_INCH_API_VERSION ||
      ONE_INCH_ALLOWED_SWAP_PROTOCOLS == null ||
      !ONE_INCH_SWAP_CHAIN_IDS
    ) {
      console.error(
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
      throw new Error('OneInch configuration is missing, check logs for more information')
    }

    return {
      config: {
        apiUrl: ONE_INCH_API_URL,
        apiKey: ONE_INCH_API_KEY,
        version: ONE_INCH_API_VERSION,
        allowedSwapProtocols: !ONE_INCH_ALLOWED_SWAP_PROTOCOLS
          ? []
          : ONE_INCH_ALLOWED_SWAP_PROTOCOLS.split(','),
        excludedSwapProtocols: !ONE_INCH_EXCLUDED_SWAP_PROTOCOLS
          ? []
          : ONE_INCH_EXCLUDED_SWAP_PROTOCOLS.split(','),
      },
      chainIds: ONE_INCH_SWAP_CHAIN_IDS.split(',')
        .map((id: string) => parseInt(id))
        .filter(isChainId),
    }
  }

  /**
   * @description Tries to parse the error message from 1inch to provide a higher level error type
   * @param errorDescription The error description from 1inch
   * @returns The parsed error type
   */
  private _parseErrorType(errorDescription: unknown): SwapErrorType {
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
