import { ITokenAmount } from '../../common/interfaces/ITokenAmount'
import type { SwapProviderType } from '../enums/SwapProviderType'
import { IPercentage } from '../../common/interfaces/IPercentage'
import { IAddress } from '../../common/interfaces/IAddress'

/**
 * Gives information about a swap operation without providing
 * the data needed to perform the swap
 */
export type QuoteData = {
  provider: SwapProviderType
  fromTokenAmount: ITokenAmount
  toTokenAmount: ITokenAmount
  /* Providers can provide multiple routes */
  routes: SwapRoute[]
  estimatedGas: string
}

/** A single swap route: an ordered list of hops the swap is split across. */
export type SwapRoute = SwapHop[]

type SwapHop = SwapHopPart[]

type SwapHopPart = {
  name: string
  part: IPercentage
  fromTokenAddress: IAddress
  toTokenAddress: IAddress
}
