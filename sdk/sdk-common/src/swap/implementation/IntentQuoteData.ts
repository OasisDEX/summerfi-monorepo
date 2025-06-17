import type { UnsignedOrder } from '@cowprotocol/cow-sdk'
import { ITokenAmount } from '../../common/interfaces/ITokenAmount'
import type { IntentSwapProviderType } from '../enums/IntentSwapProviderType'

/**
 * @name QuoteData
 * @description Represents the requested quote data for a swap between two tokens
 */
export type IntentQuoteData = {
  providerType: IntentSwapProviderType
  fromTokenAmount: ITokenAmount
  toTokenAmount: ITokenAmount
  validTo: number // timestamp
  order: UnsignedOrder
}
