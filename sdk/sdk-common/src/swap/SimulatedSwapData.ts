import { TokenAmount } from '../common/implementation/TokenAmount'
import { Percentage } from '../common/implementation/Percentage'
import { Price } from '../common/implementation/Price'
import { QuoteData } from './QuoteData'

/**
 * Represents the data returned for each Swap in simulation.
 * It is derived from the `QuoteData` type with the `estimatedGas` and 'routes' fields omitted,
 * as gas estimation is not relevant for simulation purposes.
 */
export type SimulatedSwapData = Omit<QuoteData, 'estimatedGas' | 'routes'> & {
  slippage: Percentage
  offerPrice: Price
  marketPrice: Price
  priceImpact: Percentage
  summerFee: TokenAmount
}
