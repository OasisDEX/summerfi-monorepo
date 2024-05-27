import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'

export function generateStrategyName(simulation: ISimulation<SimulationType>): string {
  return `${simulation.simulationType}${simulation.sourcePosition?.pool.id.protocol.name}${simulation.targetPosition?.pool.id.protocol.name}`
}
