import { SimulationSteps } from '@summerfi/sdk-common/simulation'
import { makeStrategy } from '../../implementation/utils'

export const importPositionStrategy = makeStrategy([
  {
    step: SimulationSteps.Import,
    optional: false,
  },
])
