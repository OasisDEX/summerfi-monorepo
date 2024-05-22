import { SimulationSteps } from '@summerfi/sdk-common/simulation'
import { makeStrategy } from '../../implementation/utils'

export const importPositionStrategy = makeStrategy([
  {
    name: 'Import',
    step: SimulationSteps.Import,
    optional: false,
  },
])
