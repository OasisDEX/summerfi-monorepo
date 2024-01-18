import { DeltaSimulationData } from './DeltaSimulationData'
import { PositionSimulationData } from './PositionSimulationData'

/**
 * @interface SimulationData
 * @description Simulation data for a position
 */
export interface SimulationData {
  /** @description Position simulation data */
  position: PositionSimulationData
  /** @description Delta simulation data */
  delta: DeltaSimulationData
}
