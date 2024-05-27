import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'

export function generateStrategyName(simulation: ISimulation<SimulationType>): string {
  // TODO: temporary workaround to use the right simulation name
  if (
    simulation.simulationType === SimulationType.Refinance ||
    simulation.simulationType === SimulationType.RefinanceDifferentPair ||
    simulation.simulationType === SimulationType.RefinanceDifferentCollateral ||
    simulation.simulationType === SimulationType.RefinanceDifferentDebt ||
    simulation.simulationType === SimulationType.RefinanceNoDebt ||
    simulation.simulationType === SimulationType.RefinanceNoDebtDifferentCollateral
  ) {
    return `Refinance${simulation.sourcePosition?.pool.id.protocol.name}${simulation.targetPosition.pool.id.protocol.name}`
  }

  return `${simulation.simulationType}${simulation.sourcePosition?.pool.id.protocol.name}${simulation.targetPosition?.pool.id.protocol.name}`
}
