import type {
  TokenAmount,
  ChainInfo,
  Percentage,
  Token,
  Address,
} from '@summerfi/sdk-common/common'
import type { QuoteData } from '../types/QuoteData'
import type { SwapData } from '../types/SwapData'

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
    chainInfo: ChainInfo
    fromAmount: TokenAmount
    toToken: Token
    recipient: Address
    slippage: Percentage
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
    chainInfo: ChainInfo
    fromAmount: TokenAmount
    toToken: Token
  }): Promise<QuoteData>
}
