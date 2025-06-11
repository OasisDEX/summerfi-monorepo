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

export class CowSwapProvider
  extends ManagerProviderBase<SwapProviderType>
  implements ISwapProvider
{
  /**
   * =============== WARNING ===============
   * DO NOT add new url's or key's when modifying this class. Try to consolidate.
   *
   * Once implementation is ready, update config and methods accordingly.
   *
   * https://docs.cow.fi/
   * */
  private readonly _apiUrl: string
  private readonly _apiKey: string
  private readonly _version: string

  private readonly _supportedChainIds: ChainId[]

  /** CONSTRUCTOR */

  constructor(params: { configProvider: IConfigurationProvider }) {
    super({ ...params, type: SwapProviderType.CowSwap })
    // Use a config getter like OneInchSwapProvider
    const { config, chainIds } = this._getConfig()
    this._apiUrl = config.apiUrl
    this._apiKey = config.apiKey
    this._version = config.version
    this._supportedChainIds = chainIds
    throw new Error('Not implemented')
  }

  /** PUBLIC */

  /** @see ISwapProvider.getSwapDataExactInput */
  async getSwapDataExactInput(params: {
    fromAmount: ITokenAmount
    toToken: IToken
    recipient: IAddress
    slippage: IPercentage
  }): Promise<SwapData> {
    throw new Error('Not implemented')
  }

  /** @see ISwapProvider.getSwapQuoteExactInput */
  async getSwapQuoteExactInput(params: {
    fromAmount: ITokenAmount
    toToken: IToken
  }): Promise<QuoteData> {
    throw new Error('Not implemented')
  }

  /** @see IManagerProvider.getSupportedChainIds */
  getSupportedChainIds(): ChainId[] {
    throw new Error('Not implemented')
  }

  /** PRIVATE */

  /**
   * Gets the CowSwap configuration from the configuration provider
   * @returns The CowSwap configuration
   */
  private _getConfig(): {
    config: { apiUrl: string; apiKey: string; version: string }
    chainIds: ChainId[]
  } {
    throw new Error('Not implemented')
  }

  /**
   * @description Tries to parse the error message from CowSwap to provide a higher level error type
   * @param errorDescription The error description from CowSwap
   * @returns The parsed error type
   */
  private _parseErrorType(errorDescription: unknown): SwapErrorType {
    throw new Error('Not implemented')
  }
}
