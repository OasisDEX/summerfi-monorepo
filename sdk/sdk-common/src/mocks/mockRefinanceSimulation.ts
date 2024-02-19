import { Address } from '~sdk-common/common'
import { RefinanceParameters, RefinanceSimulation, SimulationType } from '~sdk-common/orders'
import { Pool } from '~sdk-common/protocols'
import { Position } from '~sdk-common/users'
import { zeroAddress } from 'viem'

export function mockRefinanceSimulation(params: {
  position: Position
  pool: Pool
  parameters: RefinanceParameters
}): RefinanceSimulation {
  return {
    simulationType: SimulationType.Refinance,
    sourcePosition: params.position,
    targetPosition: { ...params.position, pool: params.pool },
    steps: [],
    positionsManagerAddress: Address.createFrom({ hexValue: zeroAddress }),
  }
}
