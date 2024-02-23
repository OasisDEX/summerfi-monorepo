import { RefinanceSimulationManager } from '~sdk-common/simulations'
import { RefinanceParameters, RefinanceSimulation } from '~sdk-common/orders'
import { Pool } from '~sdk-common/protocols'
import { mockRefinanceSimulation } from '~sdk-common/mocks'
import type { Position } from '~sdk-common/common'

export class RefinanceSimulationManagerClientImpl implements RefinanceSimulationManager {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async simulateRefinancePosition(params: {
    position: Position
    pool: Pool
    parameters: RefinanceParameters
  }): Promise<RefinanceSimulation> {
    // TODO: Implement
    return mockRefinanceSimulation(params)
  }
}
