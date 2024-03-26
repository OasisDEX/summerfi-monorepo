import { Percentage } from '@summerfi/sdk-common/common'
import { QuoteData } from './QuoteData'

/**
 * Represents the data returned for each Swap in simulation.
 * It is derived from the `QuoteData` type with the `estimatedGas` field omitted,
 * as gas estimation is not relevant for simulation purposes.
 */
export type SimulatedSwapData = Omit<QuoteData, 'estimatedGas'> & {
  slippage: Percentage
  fee: Percentage
}
