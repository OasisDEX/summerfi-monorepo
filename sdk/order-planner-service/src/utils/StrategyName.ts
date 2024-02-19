import { Simulation, SimulationType } from '@summerfi/sdk/orders'
import { Maybe } from '@summerfi/sdk/utils'

// TODO: implement this properly
export function getStrategyName(simulation: Simulation<SimulationType, unknown>): Maybe<string> {
  switch (simulation.simulationType) {
    case SimulationType.Refinance:
      return 'Refinance'
    default:
      return undefined
  }
}
