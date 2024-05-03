import { Address, ChainInfo, Percentage, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { CurrencySymbol } from '@summerfi/sdk-common/common'
import type { QuoteData, SpotData, SwapData, SwapProviderType } from '@summerfi/sdk-common/swap'

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
    chainInfo: ChainInfo
    fromAmount: TokenAmount
    toToken: Token
    recipient: Address
    slippage: Percentage
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
    chainInfo: ChainInfo
    fromAmount: TokenAmount
    toToken: Token
  }): Promise<QuoteData>

  /**
   * @name getSpotPrice
   * @description Returns the prevailing market price for a given asset
   *              in terms of a base currency
   * @param chainInfo The chain information
   * @param baseToken A price request for baseToken
   * @param quoteToken A price request - QuoteToken is optional with a USD default.
   */
  getSpotPrice(params: {
    chainInfo: ChainInfo
    baseToken: Token
    quoteToken?: CurrencySymbol | Token
  }): Promise<SpotData>
}
