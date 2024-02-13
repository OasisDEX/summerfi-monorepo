import { Simulation, SimulationType } from '~sdk/orders'

/**
 * @interface ClosePositionSimulation
 * @description Simulation data for closing a position.
 */
export type ClosePositionSimulation = Simulation<SimulationType.ColosePosition, {}>
