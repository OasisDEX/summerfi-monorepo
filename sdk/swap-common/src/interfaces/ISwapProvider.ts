import { IAddress, IPercentage, IToken, ITokenAmount } from '@summerfi/sdk-common'
import type { QuoteData, SwapData, SwapProviderType } from '@summerfi/sdk-common'
import { IManagerProvider } from '@summerfi/sdk-server-common'
/**
 * @name ISwapProvider
 * @description this is for implementing different swap provider plugins
 */
export interface ISwapProvider extends IManagerProvider<SwapProviderType> {
  /**
   * @name getSwapData
   * @description Returns the data needed to perform a swap between two tokens, by providing the
   *              exact amount of input tokens to swap
   * @param fromAmount The amount of tokens to swap
   * @param toToken The token to swap to
   * @param recipient The address that will receive the tokens
   * @param slippage The maximum slippage allowed
   */
  getSwapDataExactInput(params: {
    fromAmount: ITokenAmount
    toToken: IToken
    recipient: IAddress
    slippage: IPercentage
  }): Promise<SwapData>

  /**
   * @name getSwapQuote
   * @description Returns a quote for the swap between two tokens, by providing the exact amount
   *              of input tokens to swap. It does not return the data needed to perform the swap, only the quote
   * @param fromAmount The amount of tokens to swap
   * @param toToken The token to swap to
   */
  getSwapQuoteExactInput(params: { fromAmount: ITokenAmount; toToken: IToken }): Promise<QuoteData>
}
