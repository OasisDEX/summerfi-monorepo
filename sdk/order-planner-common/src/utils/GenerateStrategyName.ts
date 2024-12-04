import { IImportSimulation, IRefinanceSimulation } from '@summerfi/sdk-common/simulation/interfaces'

export function generateStrategyName(simulation: IRefinanceSimulation | IImportSimulation): string {
  return `${simulation.type}${simulation.sourcePosition?.vault.id.protocol.name}${simulation.targetPosition?.vault.id.protocol.name}`
}
