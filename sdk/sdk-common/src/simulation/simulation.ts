import { Position } from '~sdk-common/common/implementation'
import type { SimulationType } from './enums'
import type { Steps } from './steps'

/**
 * @interface Simulation
 * @description Simulation of a position. Specialized into the different types of simulations needed
 */
export interface Simulation<T extends SimulationType> {
  simulationType: T
  sourcePosition?: Position // TODO figure what do to when opening position (empty position or optional)
  targetPosition: Position
  steps: Steps[]
  // OPEN QUESTION: where errors and warnings and info messages?
}
