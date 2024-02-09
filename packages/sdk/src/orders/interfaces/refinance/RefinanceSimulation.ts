import { RefinanceParameters, Simulation } from '~sdk/orders'
import { Pool } from '~sdk/protocols'
import { Position } from '~sdk/users'

/**
 * @interface RefinanceSimulation
 * @description Simulation data for refinancing a position.
 */
export interface RefinanceSimulation extends Simulation {
  // TODO: review and adjust accordingly
  position: Position
  pool: Pool
  parameters: RefinanceParameters
}
