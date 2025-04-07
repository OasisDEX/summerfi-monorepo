import { QuoteData } from './QuoteData'
import { ITokenAmount } from '../../common/interfaces/ITokenAmount'
import { IPercentage } from '../../common/interfaces/IPercentage'
import { IPrice } from '../../common/interfaces/IPrice'

/**
 * Represents the data returned for each Swap in simulation.
 * It is derived from the `QuoteData` type with the `estimatedGas` and 'routes' fields omitted,
 * as gas estimation is not relevant for simulation purposes.
 */
export type SimulatedSwapData = Omit<QuoteData, 'estimatedGas' | 'routes'> & {
  slippage: IPercentage
  /* This is the impacted price that takes into account trade size */
  offerPrice: IPrice
  /* Also known as marketPrice or marketPrice with zero price impact */
  spotPrice: IPrice
  priceImpact: IPercentage | null
  summerFee: ITokenAmount
}
