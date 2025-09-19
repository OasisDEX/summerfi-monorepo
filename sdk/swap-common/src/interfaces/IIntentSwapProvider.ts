import { IAddress, IToken, ITokenAmount } from '@summerfi/sdk-common'
import type {
  IntentSwapProviderType,
  IntentQuoteData,
  ChainId,
  TransactionInfo,
  IPrice,
} from '@summerfi/sdk-common'
import { IManagerProvider } from '@summerfi/sdk-server-common'
import type { EnrichedOrder, SigningResult, UnsignedOrder } from '@cowprotocol/cow-sdk'

/**
 * @name IIntentSwapProvider
 * @description this is for implementing different swap provider plugins
 */
export interface IIntentSwapProvider extends IManagerProvider<IntentSwapProviderType> {
  /**
   * @name getSellOrderQuote
   * @description Returns a quote data for the swap between two tokens, by providing the exact amount of input tokens to swap
   * @param fromAmount The amount of tokens to swap
   * @param toToken The token to swap to
   * @param sender The address that will send the tokens
   * @param receiver The address that will receive the tokens
   * @param partiallyFillable Whether the order can be partially filled (default: false)
   * @param limitPrice The maximum price the user is willing to accept (optional)
   * @returns The quote data for the swap, including the order data which can be signed and sent to the provider
   *
   * Note: The quote does not guarantee the execution of the swap at the quoted amounts, as the market conditions may change.
   * The quote is valid until the `validTo` timestamp included in the returned data.
   */
  getSellOrderQuote(params: {
    fromAmount: ITokenAmount
    toToken: IToken
    sender: IAddress
    receiver?: IAddress
    partiallyFillable?: boolean
    limitPrice?: IPrice
  }): Promise<IntentQuoteData>

  /**
   * @name sendOrder
   * @description Sends the order to the swap provider
   * @param order The order data for the swap
   * @param fromAmount The amount of tokens to swap
   * @param sender The address that will send the tokens
   * @param chainId The chain ID where the order will be sent
   * @param signingResult The result of signing the order
   * @returns The result of sending the order, which can be one of:
   * - 'wrap_to_native': if the input token is a wrapped native token and needs to be unwrapped before sending the order
   * - 'allowance_needed': if the input token is an ERC20 token and needs to be approved for spending before sending the order
   * - 'order_sent': if the order has been successfully sent, along with the order ID
   *
   * In case of 'wrap_to_native' or 'allowance_needed', the returned transactionInfo should be used to send the required transaction.
   * After that, the sendOrder method should be called again to send the order.
   */
  sendOrder(params: {
    chainId: ChainId
    fromAmount: ITokenAmount
    sender: IAddress
    order: UnsignedOrder
    signingResult: SigningResult
  }): Promise<
    | { status: 'wrap_to_native'; transactionInfo: TransactionInfo }
    | { status: 'allowance_needed'; transactionInfo: TransactionInfo }
    | { status: 'order_sent'; orderId: string }
  >

  /**
   * @name cancelOrder
   * @description Cancels an existing order by its ID
   * @param chainId The chain ID where the order exists
   * @param orderId The ID of the order to cancel
   * @param signingResult The result of signing the cancellation
   * @returns The result of the cancellation request
   */
  cancelOrder(params: {
    chainId: ChainId
    orderId: string
    signingResult: SigningResult
  }): Promise<{ result: string }>

  /**
   * @name cancelOrderOnchain
   * @description Cancels an existing order by its ID
   * @param chainId The chain ID where the order exists
   * @param orderId The ID of the order to cancel
   * @return TransactionInfo The transaction info to send the cancellation transaction on-chain
   */
  cancelOrderOnchain(params: { chainId: ChainId; orderId: string }): Promise<TransactionInfo>

  /**
   * @name checkOrderById
   * @description Checks the status of the order by its ID
   * @param chainId The chain ID where the order exists
   * @param orderId The ID of the order to check
   * @returns The order info if found, otherwise null
   */
  checkOrder(params: {
    chainId: ChainId
    orderId: string
  }): Promise<{ order: EnrichedOrder } | null>
}
