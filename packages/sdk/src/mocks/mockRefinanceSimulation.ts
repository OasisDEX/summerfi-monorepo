import { TokenAmount } from '~sdk/common'
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
    simulationData: {
      sourcePosition: params.position,
      targetPosition: {...params.position, pool: params.pool},
      flashLoan: TokenAmount.createFrom({ token: params.position.debtAmount.token , amount: '0' }),
    }
  }
}
