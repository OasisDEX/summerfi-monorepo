import { TokenAmount, Percentage, Address } from '@summerfi/sdk-common/common'
import type { SwapProviderType } from './Enums'

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
  /* Providers can provide multiple routes */
  routes: SwapRoute[]
}

export type SwapRoute = SwapHop[]

type SwapHop = SwapHopPart[]

type SwapHopPart = {
  name: string
  part: Percentage
  fromTokenAddress: Address
  toTokenAddress: Address
}
