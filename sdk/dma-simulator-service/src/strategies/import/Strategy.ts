import { makeStrategy } from '@summerfi/simulator-common/utils'
import { DMASimulatorStepsTypes } from '../../enums/DMASimulatorStepsTypes'

export const importPositionStrategy = makeStrategy([
  {
    name: 'Import',
    step: DMASimulatorStepsTypes.Import,
    optional: false,
  },
])
