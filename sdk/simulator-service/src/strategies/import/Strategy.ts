import { SimulationSteps } from '@summerfi/sdk-common'
import { makeStrategy } from '../../implementation/utils'

export const importPositionStrategy = makeStrategy([
  {
    name: 'Import',
    step: SimulationSteps.Import,
    optional: false,
  },
])
