import { RefinanceParameters, RefinanceSimulation } from '~sdk/orders'
import { Pool } from '~sdk/protocols'
import { Position } from '~sdk/users'

export function mockRefinanceSimulation(params: {
  position: Position
  pool: Pool
  parameters: RefinanceParameters
}): RefinanceSimulation {
  return {
    position: params.position,
    pool: params.pool,
    parameters: params.parameters,
  }
}
