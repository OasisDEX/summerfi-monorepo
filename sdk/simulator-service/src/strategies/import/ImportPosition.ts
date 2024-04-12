import { ISimulation, SimulationSteps, SimulationType } from '@summerfi/sdk-common/simulation'
import { Simulator } from '../../implementation/simulator-engine'
import { ImportPositionParameters } from '@summerfi/sdk-common/orders'
import { importPositionStrategy } from './Strategy'

export async function importPosition(
  args: ImportPositionParameters,
): Promise<ISimulation<SimulationType.ImportPosition>> {
  const simulator = Simulator.create(importPositionStrategy)

  const simulation = await simulator
    .next(async () => ({
      name: 'Import',
      type: SimulationSteps.Import,
      inputs: {
        externalPosition: args.externalPosition,
      },
    }))
    .run()

  return {
    simulationType: SimulationType.ImportPosition,
    sourcePosition: args.externalPosition.position,
    targetPosition: args.externalPosition.position,
    swaps: Object.values(simulation.swaps),
    steps: Object.values(simulation.steps),
  } as ISimulation<SimulationType.ImportPosition>
}
