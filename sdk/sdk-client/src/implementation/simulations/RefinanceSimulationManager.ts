import type { RefinanceParameters } from '~sdk-common/orders/interfaces/refinance/RefinanceParameters'
import { Simulation, SimulationType } from '~sdk-common/simulation'

export class RefinanceSimulationManager {
  public async simulateRefinancePosition(
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    params: RefinanceParameters,
  ): Promise<Simulation<SimulationType.Refinance>> {
    // TODO: Implement
    return {} as Simulation<SimulationType.Refinance>
  }
}
