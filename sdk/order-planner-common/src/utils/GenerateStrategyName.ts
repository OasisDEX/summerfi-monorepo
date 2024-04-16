import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'

export function generateStrategyName(simulation: ISimulation<SimulationType>): string {
  return `${simulation.simulationType}${simulation.sourcePosition?.pool.protocol.name}${simulation.targetPosition?.pool.protocol.name}`
}
