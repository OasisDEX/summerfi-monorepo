import { Simulation, SimulationType } from '~sdk/orders'

/**
 * @interface AddCollateralSimulation
 * @description Simulation data adding collateral to a position.
 */
export type AddCollateralSimulation = Simulation<SimulationType.AddCollateral>
