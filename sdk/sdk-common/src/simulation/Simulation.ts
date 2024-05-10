import { IPositionData } from '../common/interfaces/IPosition'
import { SimulatedSwapData } from '../swap'
import type { SimulationType } from './Enums'
import type { Steps } from './Steps'

/**
 * @interface ISimulation
 * @description Simulation of a position. Specialized into the different types of simulations needed
 */
export interface ISimulation<T extends SimulationType> {
  simulationType: T
  sourcePosition?: IPositionData // TODO figure what do to when opening position (empty position or optional)
  targetPosition: IPositionData
  /* The details of any swaps required as part of the simulation */
  swaps: SimulatedSwapData[]
  steps: Steps[]
  // TODO: OPEN QUESTION: where errors and warnings and info messages?
}
