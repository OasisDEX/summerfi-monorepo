import { Position } from '~sdk-common/common/implementation'
import { RefinanceParameters, RefinanceSimulation, SimulationType } from '~sdk-common/orders'
import { Pool } from '~sdk-common/protocols'

export function mockRefinanceSimulation(params: {
  position: Position
  pool: Pool
  parameters: RefinanceParameters
}): RefinanceSimulation {
  return {
    simulationType: SimulationType.Refinance,
    sourcePosition: params.position,
    targetPosition: Position.createFrom({ ...params.position, pool: params.pool }),
    steps: [],
  }
}
