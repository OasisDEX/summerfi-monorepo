import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { getRefinanceSimSourcePosition } from './SourcePosition'
import { getRefinanceSimTargetPosition } from './TargetPosition'

export function getRefinanceSimulationMakerSpark(): Simulation<SimulationType.Refinance> {
  return {
    simulationType: SimulationType.Refinance,
    sourcePosition: getRefinanceSimSourcePosition(),
    targetPosition: getRefinanceSimTargetPosition(),
    steps: [],
  }
}
