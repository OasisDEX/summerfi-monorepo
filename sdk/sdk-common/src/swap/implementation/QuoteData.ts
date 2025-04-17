import { ITokenAmount } from '../../common/interfaces/ITokenAmount'
import type { SwapProviderType } from '../enums/SwapProviderType'
import { IPercentage } from '../..//common/interfaces/IPercentage'
import { IAddress } from '../..//common/interfaces/IAddress'

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
