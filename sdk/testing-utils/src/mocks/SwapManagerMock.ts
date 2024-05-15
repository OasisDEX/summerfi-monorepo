import { Address, ChainInfo, Percentage, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { SwapData, QuoteData, SwapProviderType } from '@summerfi/sdk-common/swap'
import { ISwapManager, ISwapProvider } from '@summerfi/swap-common/interfaces'
import { ManagerWithProvidersBase } from '@summerfi/sdk-server-common'
export class SwapManagerMock
  extends ManagerWithProvidersBase<SwapProviderType, ISwapProvider>
  implements ISwapManager
{
  private _swapDataReturnValue: SwapData = {} as SwapData
  private _quoteDataReturnValue: QuoteData = {} as QuoteData
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

  constructor() {
    super({
      providers: [],
    })
  }

  setSwapData(swapData: SwapData): void {
    this._swapDataReturnValue = swapData
  }

  setQuoteData(quoteData: QuoteData): void {
    this._quoteDataReturnValue = quoteData
  }

  setSummerFee(summerFee: Percentage): void {
    this._summerFeeValue = summerFee
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
