import type {
  IPercentage,
  IAddress,
  IToken,
  ITokenAmount,
  QuoteData,
  SwapData,
  SwapProviderType,
} from '@summerfi/sdk-common'
import { IManagerWithProviders } from '@summerfi/sdk-server-common'
import { ISwapProvider } from './ISwapProvider'

/**
 * @name ISwapManager
 * @description This is the highest level interface that will choose and call
 * appropriate provider for a swap
 */
export interface ISwapManager extends IManagerWithProviders<SwapProviderType, ISwapProvider> {
  /**
   * @name getSwapDataExactInput
   * @description Returns the data needed to perform a swap between two tokens, by providing the
   *              exact amount of input tokens to swap
   * @param fromAmount The amount of tokens to swap
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
   * @name getSwapQuoteExactInput
   * @description Returns a quote for the swap between two tokens, by providing the exact amount
   *              of input tokens to swap. It does not return the data needed to perform the swap, only the quote
   * @param fromAmount The amount of tokens to swap
   * @param toToken The token to swap to
   */
  getSwapQuoteExactInput(params: { fromAmount: ITokenAmount; toToken: IToken }): Promise<QuoteData>

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
