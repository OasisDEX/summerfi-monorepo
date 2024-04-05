import { Price } from '../common'
import type { SwapProviderType } from './Enums'

/**
 * @name SpotData
 * @description Gives the current market price for a specific asset
 */
export type SpotData = {
  provider: SwapProviderType
  price: Price
}
