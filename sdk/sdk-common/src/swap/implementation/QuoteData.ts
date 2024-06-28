import { ITokenAmount, IAddress, IPercentage } from '@summerfi/sdk-common/common'
import type { SwapProviderType } from '../enums/SwapProviderType'

/**
 * @name QuoteData
 * @description Gives information about a swap operation without providing
 *              the data needed to perform the swap
 */
export type QuoteData = {
  provider: SwapProviderType
  fromTokenAmount: ITokenAmount
  toTokenAmount: ITokenAmount
  estimatedGas: string
  /* Providers can provide multiple routes */
  routes: SwapRoute[]
}

export type SwapRoute = SwapHop[]

type SwapHop = SwapHopPart[]

type SwapHopPart = {
  name: string
  part: IPercentage
  fromTokenAddress: IAddress
  toTokenAddress: IAddress
}
