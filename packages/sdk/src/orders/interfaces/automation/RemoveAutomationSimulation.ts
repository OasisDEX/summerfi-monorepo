import { Simulation, SimulationType } from '~sdk/orders'

interface RemoveAutomationSimulationData {}

/**
 * @interface RemoveAutomationSimulation
 * @description Simulation data for adding automation to a position.
 */
export type RemoveAutomationSimulation = Simulation<
  SimulationType.RemoveAutomation,
  RemoveAutomationSimulationData
>
