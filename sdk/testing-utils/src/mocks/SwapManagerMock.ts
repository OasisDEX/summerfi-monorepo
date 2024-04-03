import {
  Address,
  ChainInfo,
  Percentage,
  Token,
  TokenAmount,
  CurrencySymbol,
} from '@summerfi/sdk-common/common'
import { SpotData, SwapData, QuoteData } from '@summerfi/sdk-common/swap'
import { ISwapManager } from '@summerfi/swap-common/interfaces'

export class SwapManagerMock implements ISwapManager {
  private _swapDataReturnValue: SwapData = {} as SwapData
  private _quoteDataReturnValue: QuoteData = {} as QuoteData

  private _spotPricesReturnValue: SpotData = {} as SpotData

  private _lastGetSwapDataExactInputParams:
    | {
        chainInfo: ChainInfo
        fromAmount: TokenAmount
        toToken: Token
        recipient: Address
        slippage: Percentage
      }
    | undefined

  private _lastGetSwapQuoteExactInputParams:
    | {
        chainInfo: ChainInfo
        fromAmount: TokenAmount
        toToken: Token
      }
    | undefined

  setSwapData(swapData: SwapData): void {
    this._swapDataReturnValue = swapData
  }

  setQuoteData(quoteData: QuoteData): void {
    this._quoteDataReturnValue = quoteData
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getSpotPrices(params: {
    chainInfo: ChainInfo
    tokens: Token[]
    quoteCurrency?: CurrencySymbol
  }): Promise<SpotData> {
    return this._spotPricesReturnValue
  }

  async getSwapDataExactInput(params: {
    chainInfo: ChainInfo
    fromAmount: TokenAmount
    toToken: Token
    recipient: Address
    slippage: Percentage
  }): Promise<SwapData> {
    this._lastGetSwapDataExactInputParams = params
    return this._swapDataReturnValue
  }

  async getSwapQuoteExactInput(params: {
    chainInfo: ChainInfo
    fromAmount: TokenAmount
    toToken: Token
  }): Promise<QuoteData> {
    this._lastGetSwapQuoteExactInputParams = params
    return this._quoteDataReturnValue
  }

  get swapDataReturnValue(): SwapData {
    return this._swapDataReturnValue
  }

  get quoteDataReturnValue(): QuoteData {
    return this._quoteDataReturnValue
  }

  get lastGetSwapDataExactInputParams():
    | {
        chainInfo: ChainInfo
        fromAmount: TokenAmount
        toToken: Token
        recipient: Address
        slippage: Percentage
      }
    | undefined {
    return this._lastGetSwapDataExactInputParams
  }

  get lastGetSwapQuoteExactInputParams():
    | {
        chainInfo: ChainInfo
        fromAmount: TokenAmount
        toToken: Token
      }
    | undefined {
    return this._lastGetSwapQuoteExactInputParams
  }
}
