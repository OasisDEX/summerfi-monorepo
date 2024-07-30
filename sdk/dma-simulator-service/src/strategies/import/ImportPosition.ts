import { IImportPositionParameters } from '@summerfi/sdk-common/orders'
import { Simulator } from '@summerfi/simulator-common/'
import { DMASimulatorStepsTypes } from '../../enums/DMASimulatorStepsTypes'
import { DMAStateReducers, DMAStepOutputProcessors } from '../../implementation'
import { DMASimulatorSteps } from '../../implementation/DMASimulatorSteps'
import { ImportSimulation } from '../../implementation/simulations/ImportSimulation'
import { DMASimulatorConfig } from '../../interfaces/DMASimulatorConfig'
import { IImportSimulation } from '../../interfaces/IImportSimulation'
import { importPositionStrategy } from './Strategy'

export async function importPosition(args: IImportPositionParameters): Promise<IImportSimulation> {
  const simulatorConfig: DMASimulatorConfig = {
    schema: importPositionStrategy,
    outputProcessors: DMAStepOutputProcessors,
    stateReducers: DMAStateReducers,
    state: {
      swaps: [],
      balances: {},
      positions: {},
      steps: [],
    },
  }
  const simulator = Simulator.create(simulatorConfig)

  const simulation = await simulator
    .next(async () => ({
      name: 'Import',
      type: DMASimulatorStepsTypes.Import,
      inputs: {
        externalPosition: args.externalPosition,
      },
    }))
    .run()

  return ImportSimulation.createFrom({
    sourcePosition: args.externalPosition,
    targetPosition: args.externalPosition,
    steps: Object.values(simulation.steps) as DMASimulatorSteps[],
  })
}
