import type { QuoteData } from '@summerfi/sdk-common'
import type { IToken, ITokenAmount, IPercentage } from '@summerfi/sdk-common'

/**
 * @name ISwapManagerClient
 * @description Interface for the SwapManager client implementation.
 * @see ISwapManager
 */
export interface ISwapManagerClient {
  /**
   * @method getSwapQuoteExactInput
   * @description Retrieves a swap quote for a given input amount and token
   *
   * @param fromAmount The amount to swap
   * @param toToken The token to swap to
   * @param slippage The slippage for the swap
   *
   * @returns The swap quote for the given input amount and token
   */
  getSwapQuoteExactInput(params: {
    fromAmount: ITokenAmount
    toToken: IToken
    slippage: IPercentage
  }): Promise<QuoteData>
}
