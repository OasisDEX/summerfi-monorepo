import type { UnsignedOrder } from '@cowprotocol/cow-sdk'
import type { ITokenAmount } from '../../common/interfaces/ITokenAmount'
import type { IntentSwapProviderType } from '../enums/IntentSwapProviderType'
import type { IPrice } from '../../common/interfaces/IPrice'

/**
 * @name IntentQuoteData
 * @description Represents the requested quote data for a swap between two tokens
 */
export type IntentQuoteData = {
  providerType: IntentSwapProviderType
  fromAmount: ITokenAmount
  toAmount: ITokenAmount
  limitPrice?: IPrice
  validTo: number // timestamp
  order: UnsignedOrder
}
