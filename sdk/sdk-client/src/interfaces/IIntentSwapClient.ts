import type {
  IToken,
  ITokenAmount,
  IntentQuoteData,
  ChainId,
  IAddress,
  TransactionInfo,
} from '@summerfi/sdk-common'
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
  getSellOrderQuote(params: {
    fromAmount: ITokenAmount
    toToken: IToken
    from: IAddress
    receiver?: IAddress
    partiallyFillable?: boolean
    limitPrice?: string
  }): Promise<IntentQuoteData>

  /**
   * Sends the order to the swap provider
   */
  sendOrder(params: {
    fromAmount: ITokenAmount
    chainId: ChainId
    order: UnsignedOrder
  }): Promise<
    | { status: 'wrap_to_native'; transactionInfo: TransactionInfo }
    | { status: 'allowance_needed'; transactionInfo: TransactionInfo }
    | { status: 'order_sent'; orderId: string }
  >

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
