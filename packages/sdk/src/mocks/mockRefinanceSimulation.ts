import { RefinanceParameters, RefinanceSimulation, SimulationType } from '~sdk/orders'
import { Pool } from '~sdk/protocols'
import { Position } from '~sdk/users'

export function mockRefinanceSimulation(params: {
  position: Position
  pool: Pool
  parameters: RefinanceParameters
}): RefinanceSimulation {
  return {
    simulationType: SimulationType.Refinance,
    sourcePosition: params.position,
    targetPosition: { ...params.position, pool: params.pool },
    steps: []
  }
}
