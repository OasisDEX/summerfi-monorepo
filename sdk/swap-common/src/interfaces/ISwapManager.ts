import type {
  IPercentage,
  IAddress,
  IToken,
  ITokenAmount,
  IChainInfo,
} from '@summerfi/sdk-common/common'
import type { QuoteData, SwapData } from '@summerfi/sdk-common/swap'

/**
 * @name ISwapManager
 * @description This is the highest level interface that will choose and call
 * appropriate provider for a swap
 */
export interface ISwapManager {
  /**
   * @name getSwapDataExactInput
   * @description Returns the data needed to perform a swap between two tokens, by providing the
   *              exact amount of input tokens to swap
   * @param chainInfo The chain information
   * @param fromAmount The amount of tokens to swap
   * @param recipient The address that will receive the tokens
   * @param slippage The maximum slippage allowed
   */
  getSwapDataExactInput(params: {
    chainInfo: IChainInfo
    fromAmount: ITokenAmount
    toToken: IToken
    recipient: IAddress
    slippage: IPercentage
  }): Promise<SwapData>

  /**
   * @name getSwapQuoteExactInput
   * @description Returns a quote for the swap between two tokens, by providing the exact amount
   *              of input tokens to swap. It does not return the data needed to perform the swap, only the quote
   * @param chainInfo The chain information
   * @param fromAmount The amount of tokens to swap
   * @param toToken The token to swap to
   */
  getSwapQuoteExactInput(params: {
    chainInfo: IChainInfo
    fromAmount: ITokenAmount
    toToken: IToken
  }): Promise<QuoteData>

  /**
   * @name getSummerFee
   * @description Returns the Summer fee to charge on the swap
   * @param fromToken The source token
   * @param toToken The target token
   */
  getSummerFee(params: {
    from: {
      token: IToken
    }
    to: {
      token: IToken
    }
  }): Promise<IPercentage>
}
