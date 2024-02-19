import { Simulation, SimulationType } from '~sdk-common/orders'

/**
 * @interface AddCollateralSimulation
 * @description Simulation data adding collateral to a position.
 */
export type AddCollateralSimulation = Simulation<SimulationType.AddCollateral>
