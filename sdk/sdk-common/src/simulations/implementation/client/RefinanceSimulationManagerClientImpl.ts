import { RefinanceSimulationManager } from '~sdk-common/simulations'
import { RefinanceParameters, RefinanceSimulation } from '~sdk-common/orders'
import { Pool } from '~sdk-common/protocols'
import { mockRefinanceSimulation } from '~sdk-common/mocks'
import type { Position } from '~sdk-common/common/implementation'

export class RefinanceSimulationManagerClientImpl implements RefinanceSimulationManager {
  public async simulateRefinancePosition(params: {
    position: Position
    pool: Pool
    parameters: RefinanceParameters
  }): Promise<RefinanceSimulation> {
    // TODO: Implement
    return mockRefinanceSimulation(params)
  }
}
