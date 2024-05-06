import {
  IAddress,
  IChainInfo,
  IPercentage,
  IToken,
  ITokenAmount,
} from '@summerfi/sdk-common/common'
import type { QuoteData, SwapData, SwapProviderType } from '@summerfi/sdk-common/swap'

/**
 * @name ISwapProvider
 * @description this is for implementing different swap provider plugins
 */
export interface ISwapProvider {
  /**
   * @name type
   * @description The type of the swap provider, to identify it
   */
  type: SwapProviderType

  /**
   * @name getSwapData
   * @description Returns the data needed to perform a swap between two tokens, by providing the
   *              exact amount of input tokens to swap
   * @param chainInfo The chain information
   * @param fromAmount The amount of tokens to swap
   * @param toToken The token to swap to
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
   * @name getSwapQuote
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
}
