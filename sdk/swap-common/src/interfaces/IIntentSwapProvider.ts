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
   * @param from The address that will send the tokens
   * @param receiver The address that will receive the tokens
   */
  getSellOrderQuote(params: {
    fromAmount: ITokenAmount
    toToken: IToken
    from: IAddress
    receiver?: IAddress
    partiallyFillable?: boolean
    limitPrice?: IPrice
  }): Promise<IntentQuoteData>

  /**
   * @name sendOrder
   * @description Sends the order to the swap provider
   * @param order The order data for the swap
   * @param signature The signature of the order
   */
  sendOrder(params: {
    fromAmount: ITokenAmount
    chainId: ChainId
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
   */
  cancelOrderOnchain(params: { chainId: ChainId; orderId: string }): Promise<TransactionInfo>

  /**
   * @name checkOrderById
   * @description Checks the status of the order by its ID
   * @param orderId The ID of the order to check
   */
  checkOrder(params: {
    chainId: ChainId
    orderId: string
  }): Promise<{ order: EnrichedOrder } | null>
}
