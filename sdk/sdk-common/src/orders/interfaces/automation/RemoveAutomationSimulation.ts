import { Simulation, SimulationType } from '~sdk-common/orders'

/**
 * @interface RemoveAutomationSimulation
 * @description Simulation data for adding automation to a position.
 */
export type RemoveAutomationSimulation = Simulation<SimulationType.RemoveAutomation>
