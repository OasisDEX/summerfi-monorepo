import { Simulation, SimulationType } from '~sdk-common/orders'

interface AddAutomationSimulationData {}

/**
 * @interface AddAutomationSimulation
 * @description Simulation data for adding automation to a position.
 */
export interface AddAutomationSimulation
  extends Simulation<SimulationType.AddAutomation, AddAutomationSimulationData> {
  // TODO: review and adjust accordingly
}
