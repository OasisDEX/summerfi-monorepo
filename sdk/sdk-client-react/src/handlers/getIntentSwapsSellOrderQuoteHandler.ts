import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { Address, type AddressValue, type IToken, type ITokenAmount } from '@summerfi/sdk-common'

/**
 * @name getIntentSwapsSellOrderQuoteHandler
 * @description Returns a quote for a sell order between two tokens
 * @param params.fromAmount The token amount to sell
 * @param params.toToken The token to receive
 * @param params.sender The sender's address
 * @param params.receiver Optional receiver address (defaults to sender)
 * @param params.partiallyFillable Whether the order can be partially filled
 * @param params.limitPrice Optional limit price as a string
 * @returns The quote data including the order to sign and send
 */
export const getIntentSwapsSellOrderQuoteHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    fromAmount,
    toToken,
    sender,
    receiver,
    partiallyFillable,
    limitPrice,
    slippagePercentage,
  }: {
    fromAmount: ITokenAmount
    toToken: IToken
    sender: AddressValue
    receiver?: AddressValue
    partiallyFillable?: boolean
    limitPrice?: string
    slippagePercentage?: number
  }) => {
    return sdk.intentSwaps.getSellOrderQuote({
      fromAmount,
      toToken,
      sender: Address.createFromEthereum({ value: sender }),
      receiver: receiver ? Address.createFromEthereum({ value: receiver }) : undefined,
      partiallyFillable,
      limitPrice,
      slippagePercentage,
    })
  }
