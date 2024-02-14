import { RefinanceParameters, Simulation } from '~sdk/orders'
import { Pool } from '~sdk/protocols'
import { Position } from '~sdk/users'
import { isRefinanceParameters } from './RefinanceParameters'

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

export function isRefinanceSimulation(simulation: Simulation): simulation is RefinanceSimulation {
  return (
    typeof simulation === 'object' &&
    simulation !== null &&
    'position' in simulation &&
    'pool' in simulation &&
    'parameters' in simulation &&
    isRefinanceParameters(simulation.parameters)
  )
}
