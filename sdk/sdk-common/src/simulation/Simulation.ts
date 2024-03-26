import { IPosition } from '../common/interfaces/IPosition'
import type { SimulationType } from './Enums'
import type { Steps } from './Steps'

/**
 * @interface Simulation
 * @description Simulation of a position. Specialized into the different types of simulations needed
 */
export interface Simulation<T extends SimulationType> {
  simulationType: T
  sourcePosition?: IPosition // TODO figure what do to when opening position (empty position or optional)
  targetPosition: IPosition
  steps: Steps[]
  // TODO: OPEN QUESTION: where errors and warnings and info messages?
}
