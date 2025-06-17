import type { IToken, ITokenAmount, IntentQuoteData, ChainId, IAddress } from '@summerfi/sdk-common'
import type { EnrichedOrder, UnsignedOrder } from '@cowprotocol/cow-sdk'

/**
 * @name IIntentSwapClient
 * @description Interface for the IntentSwap client implementation.
 * @see IIntentSwapProvider
 */
export interface IIntentSwapClient {
  /**
   * Returns a quote data for the swap between two tokens, by providing the exact amount of input tokens to swap
   */
  getOrderFromAmount(params: {
    fromAmount: ITokenAmount
    toToken: IToken
    from: IAddress
    receiver?: IAddress
    partiallyFillable?: boolean
  }): Promise<IntentQuoteData>

  /**
   * Sends the order to the swap provider
   */
  sendOrder(params: { chainId: ChainId; order: UnsignedOrder }): Promise<{ orderId: string }>

  /**
   * Cancels an existing order by its ID
   */
  cancelOrder(params: { chainId: ChainId; orderId: string }): Promise<{ result: string }>

  /**
   * Checks the status of the order by its ID
   */
  checkOrder(params: {
    chainId: ChainId
    orderId: string
  }): Promise<{ order: EnrichedOrder } | null>
}
