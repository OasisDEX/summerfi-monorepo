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
import {
  OrderBookApi,
  SupportedChainId,
  OrderQuoteRequest,
  OrderQuoteSideKindSell,
  ALL_SUPPORTED_CHAIN_IDS,
} from '@cowprotocol/cow-sdk'
import type { SwapProviderConfig } from '../Types'

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

  private readonly _supportedChainIds: SupportedChainId[] = ALL_SUPPORTED_CHAIN_IDS

  /** CONSTRUCTOR */

  constructor(params: { configProvider: IConfigurationProvider }) {
    super({ ...params, type: SwapProviderType.CowSwap })
    // Use a config getter like OneInchSwapProvider
    const { config } = this._getConfig()
    this._apiUrl = config.apiUrl
    this._apiKey = config.apiKey
    this._version = config.version
    throw new Error('Not implemented')
  }

  /** PUBLIC */

  /** @see ISwapProvider.getSwapQuoteExactInput */
  async getSwapQuoteExactInput(params: {
    fromAmount: ITokenAmount
    toToken: IToken
    from: IAddress
    receiver?: IAddress
  }): Promise<QuoteData> {
    const chainId = params.fromAmount.token.chainInfo.chainId

    if (this.getSupportedChainIds().includes(chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported by CowSwapProvider`)
    }
    const orderBookApi = new OrderBookApi({ chainId: chainId as SupportedChainId })

    const sellToken = params.fromAmount.token.address.value
    const sellAmount = params.fromAmount.toSolidityValue().toString()
    const buyToken = params.toToken.address.value

    const quoteRequest: OrderQuoteRequest = {
      sellToken,
      buyToken,
      sellAmountBeforeFee: sellAmount,
      kind: OrderQuoteSideKindSell.SELL,
      from: params.from.value,
    }

    const { quote } = await orderBookApi.getQuote(quoteRequest)

    return {
      provider: SwapProviderType.CowSwap,
      fromTokenAmount: params.fromAmount,
      toTokenAmount: TokenAmount.createFromBaseUnit({
        token: params.toToken,
        amount: quote.buyAmount,
      }),
      validTo: quote.validTo,
    }
  }

  /** @see ISwapProvider.getSwapDataExactInput */
  async getSwapDataExactInput(params: {
    fromAmount: ITokenAmount
    toToken: IToken
    recipient: IAddress
    slippage: IPercentage
  }): Promise<SwapData> {
    throw new Error('Not implemented')
  }

  /** @see IManagerProvider.getSupportedChainIds */
  getSupportedChainIds(): ChainId[] {
    return this._supportedChainIds.reduce<ChainId[]>((acc, id) => {
      if (isChainId(id)) {
        acc.push(id)
      }
      return acc
    }, [])
  }

  /** PRIVATE */

  /**
   * Gets the CowSwap configuration from the configuration provider
   * @returns The CowSwap configuration
   */
  private _getConfig(): {
    config: SwapProviderConfig
  } {
    const COW_SWAP_API_URL = this.configProvider.getConfigurationItem({ name: 'COW_SWAP_API_URL' })
    const COW_SWAP_API_KEY = this.configProvider.getConfigurationItem({ name: 'COW_SWAP_API_KEY' })
    const COW_SWAP_API_VERSION = this.configProvider.getConfigurationItem({
      name: 'COW_SWAP_API_VERSION',
    })

    if (!COW_SWAP_API_URL || !COW_SWAP_API_KEY || !COW_SWAP_API_VERSION) {
      console.error(
        JSON.stringify(
          Object.entries({
            COW_SWAP_API_URL,
            COW_SWAP_API_KEY,
            COW_SWAP_API_VERSION,
          }),
          null,
          2,
        ),
      )
      throw new Error('CowSwap configuration is missing, check logs for more information')
    }

    return {
      config: {
        apiUrl: COW_SWAP_API_URL,
        apiKey: COW_SWAP_API_KEY,
        version: COW_SWAP_API_VERSION,
        authHeader: `Bearer ${COW_SWAP_API_KEY}`,
      },
    }
  }

  /**
   * @description Tries to parse the error message from CowSwap to provide a higher level error type
   * @param errorDescription The error description from CowSwap
   * @returns The parsed error type
   */
  private _parseErrorType(): SwapErrorType {
    return SwapErrorType.Unknown
  }
}
