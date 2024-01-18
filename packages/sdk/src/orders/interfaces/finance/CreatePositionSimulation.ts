import { SimulationData } from '~sdk/orders'
import { CreatePositionSimulationData } from './CreatePositionSimulationData'

/**
 * @interface CreatePositionSimulation
 * @description Simulation data for a position. The position can be either a new position or an existing one.*
 */
export interface CreatePositionSimulation extends SimulationData {
  /** Simulation data for creating new position */
  simulationData: CreatePositionSimulationData
}
