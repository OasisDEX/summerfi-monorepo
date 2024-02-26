import { TokenAmount, Position } from '~sdk-common/common/implementation'
import { RefinanceParameters, RefinanceSimulation, SimulationType } from '~sdk-common/orders'
import { Pool } from '~sdk-common/protocols'

export function mockRefinanceSimulation(params: {
  position: Position
  pool: Pool
  parameters: RefinanceParameters
}): RefinanceSimulation {
  return {
    simulationType: SimulationType.Refinance,
    simulationData: {
      sourcePosition: params.position,
      targetPosition: Position.createFrom({ ...params.position, pool: params.pool }),
      flashLoan: TokenAmount.createFrom({ token: params.position.debtAmount.token, amount: '0' }),
    },
  }
}
