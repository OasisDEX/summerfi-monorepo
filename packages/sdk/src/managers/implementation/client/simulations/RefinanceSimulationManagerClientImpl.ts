import { RefinanceSimulationManager } from '~sdk/managers'
import { RefinanceParameters, RefinanceSimulation } from '~sdk/orders'
import { Pool } from '~sdk/protocols'
import { Position } from '~sdk/user'

export class RefinanceSimulationManagerClientImpl implements RefinanceSimulationManager {
  public async simulateRefinance(params: {
    position: Position
    pool: Pool
    parameters: RefinanceParameters
  }): Promise<RefinanceSimulation> {
    // TODO: Implement
    return {} as RefinanceSimulation
  }
}
