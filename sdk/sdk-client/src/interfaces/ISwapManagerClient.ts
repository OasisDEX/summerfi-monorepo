import type { QuoteData, IToken, ITokenAmount, IPercentage } from '@summerfi/sdk-common'

/**
 * Interface for the SwapManager client implementation.
 *
 * @see ISwapManager
 */
export interface ISwapManagerClient {
  /**
   * Retrieves a swap quote for a given input amount and token
   *
   * @param params.fromAmount The amount to swap
   * @param params.toToken The token to swap to
   * @param params.slippage The slippage for the swap
   *
   * @returns The swap quote for the given input amount and token
   */
  getSwapQuoteExactInput(params: {
    fromAmount: ITokenAmount
    toToken: IToken
    slippage: IPercentage
  }): Promise<QuoteData>
}
