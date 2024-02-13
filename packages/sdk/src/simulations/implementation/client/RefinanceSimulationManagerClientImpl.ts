import { RefinanceSimulationManager } from '~sdk/simulations'
import { RefinanceParameters, RefinanceSimulation } from '~sdk/orders'
import { Pool } from '~sdk/protocols'
import { Position } from '~sdk/users'
import { mockRefinanceSimulation } from '~sdk/mocks'

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
