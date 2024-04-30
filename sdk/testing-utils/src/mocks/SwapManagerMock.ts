import { Address, ChainInfo, Percentage, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { SpotData, SwapData, QuoteData } from '@summerfi/sdk-common/swap'
import { ISwapManager } from '@summerfi/swap-common/interfaces'

export class SwapManagerMock implements ISwapManager {
  private _swapDataReturnValue: SwapData = {} as SwapData
  private _quoteDataReturnValue: QuoteData = {} as QuoteData
  private _spotDataReturnValue: SpotData = {} as SpotData
  private _summerFeeValue: Percentage = Percentage.createFrom({ value: 0 })

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

  setSpotData(spotData: SpotData): void {
    this._spotDataReturnValue = spotData
  }

  setSummerFee(summerFee: Percentage): void {
    this._summerFeeValue = summerFee
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getSpotPrice(params: { chainInfo: ChainInfo; baseToken: Token }): Promise<SpotData> {
    return this._spotDataReturnValue
  }

  async getSummerFee(): Promise<Percentage> {
    return this._summerFeeValue
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
