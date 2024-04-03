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
  /* This is the impacted price that takes into account trade size */
  offerPrice: Price
  /* This is the un-impacted blend of market prices from various DEXs */
  marketPrice: Price
  priceImpact: Percentage
  summerFee: TokenAmount
}
