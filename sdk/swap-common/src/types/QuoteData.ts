import { TokenAmount } from '@summerfi/sdk-common/common'
import type { SwapProviderType } from '../enums/SwapProviderType'

/**
 * @name QuoteData
 * @description Gives information about a swap operation without providing
 *              the data needed to perform the swap
 */
export type QuoteData = {
  provider: SwapProviderType
  fromTokenAmount: TokenAmount
  toTokenAmount: TokenAmount
  estimatedGas: string
}
