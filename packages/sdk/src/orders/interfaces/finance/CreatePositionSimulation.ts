import { Simulation, SimulationType } from '~sdk/orders'

/**
 * @interface CreatePositionSimulation
 * @description Simulation data for a position. The position can be either a new position or an existing one.*
 */
export type CreatePositionSimulation = Simulation<SimulationType.CreatePosition, unknown>
