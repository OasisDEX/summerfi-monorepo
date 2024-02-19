import { Simulation } from '~sdk-common/orders'
import { SimulationType } from '../common/SimulationType'

/**
 * @interface CreatePositionSimulation
 * @description Simulation data for a position. The position can be either a new position or an existing one.*
 */
export type CreatePositionSimulation = Simulation<SimulationType.CreatePosition>
