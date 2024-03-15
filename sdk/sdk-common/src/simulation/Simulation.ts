import type { Position } from '~sdk-common/common/implementation/Position'
import type { SimulationType } from './Enums'
import type { Steps } from './Steps'

/**
 * @interface Simulation
 * @description Simulation of a position. Specialized into the different types of simulations needed
 */
export interface Simulation<T extends SimulationType> {
  simulationType: T
  sourcePosition?: Position // TODO figure what do to when opening position (empty position or optional)
  targetPosition: Position
  steps: Steps[]
  // TODO:
  // OPEN QUESTION: where errors and warnings and info messages?
}
