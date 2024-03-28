import type {
  TokenAmount,
  ChainInfo,
  Percentage,
  Token,
  Address,
  CurrencySymbol,
} from '@summerfi/sdk-common/common'
import { IProtocol } from '@summerfi/sdk-common/protocols'
import { SpotData } from '@summerfi/sdk-common/swap'
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

  /**
   * @name getSummerFee
   * @description Returns the Summer fee to charge on the swap
   * @param protocol The protocol name and chain info
   * @param fromToken The source token
   * @param toToken The target token
   */
  getSummerFee(params: {
    from: {
      protocol: IProtocol
      token: Token
    }
    to: {
      protocol: IProtocol
      token: Token
    }
  }): Percentage
}
