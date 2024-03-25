import { Position } from '../common/implementation/Position'
import type { SimulationType } from './Enums'
import type { Steps } from './Steps'

/**
 * @interface Simulation
 * @description Simulation of a position. Specialized into the different types of simulations needed
 */
export interface Simulation<T extends SimulationType> {
  simulationType: T
  sourcePosition?: Position // TODO figure what do to when opening position (empty position or optional)
  /* The output of the simulation. The simulated position is the target position */
  targetPosition: Position
  /* The details of any swaps required as part of the simulation */
  swaps: any
  steps: Steps[]
  // TODO: OPEN QUESTION: where errors and warnings and info messages?
}
