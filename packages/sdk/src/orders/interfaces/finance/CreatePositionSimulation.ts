import { Simulation } from '~sdk/orders'
import { CreatePositionSimulation } from './CreatePositionSimulation'

/**
 * @interface CreatePositionSimulation
 * @description Simulation data for a position. The position can be either a new position or an existing one.*
 */
export interface CreatePositionSimulation extends Simulation {
  /** Simulation data for creating new position */
  simulationData: CreatePositionSimulation
}
