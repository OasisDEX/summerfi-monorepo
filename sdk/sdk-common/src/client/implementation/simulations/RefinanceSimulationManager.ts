import { RefinanceParameters } from '../../../orders/interfaces/refinance/RefinanceParameters'
import { SimulationType } from '../../../simulation/enums'
import { Simulation } from '../../../simulation/simulation'

export class RefinanceSimulationManager {
  public async simulateRefinancePosition(
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    params: RefinanceParameters,
  ): Promise<Simulation<SimulationType.Refinance>> {
    // TODO: Implement
    return {} as Simulation<SimulationType.Refinance>
  }
}
