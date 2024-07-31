import { IImportSimulation, ImportSimulation } from '@summerfi/sdk-common'
import { IImportPositionParameters } from '@summerfi/sdk-common/orders'
import { SimulationSteps, SimulationType } from '@summerfi/sdk-common/simulation'
import { Simulator } from '../../implementation/simulator-engine'
import { importPositionStrategy } from './Strategy'

export async function importPosition(args: IImportPositionParameters): Promise<IImportSimulation> {
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

  return ImportSimulation.createFrom({
    type: SimulationType.ImportPosition,
    sourcePosition: args.externalPosition,
    targetPosition: args.externalPosition,
    steps: Object.values(simulation.steps),
  })
}
