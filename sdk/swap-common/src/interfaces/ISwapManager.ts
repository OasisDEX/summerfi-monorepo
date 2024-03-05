import type {
  TokenAmount,
  ChainInfo,
  Percentage,
  Token,
  Address,
} from '@summerfi/sdk-common/common'
import { SwapData } from '~swap-common/types/SwapData'
import { QuoteData } from '~swap-common/types/QuoteData'

/**
 * @name ISwapManager
 * @description Provides information about how to swap between two tokens and has access
 *              to different swap providers
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
