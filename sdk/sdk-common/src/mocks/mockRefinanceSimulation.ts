import { TokenAmount } from '~sdk-common/common'
import { RefinanceParameters, RefinanceSimulation, SimulationType } from '~sdk-common/orders'
import { Pool } from '~sdk-common/protocols'
import { Position } from '~sdk-common/users'

export function mockRefinanceSimulation(params: {
  position: Position
  pool: Pool
  parameters: RefinanceParameters
}): RefinanceSimulation {
  return {
    simulationType: SimulationType.Refinance,
    simulationData: {
      sourcePosition: params.position,
      targetPosition: { ...params.position, pool: params.pool },
      flashLoan: TokenAmount.createFrom({ token: params.position.debtAmount.token, amount: '0' }),
    },
  }
}
