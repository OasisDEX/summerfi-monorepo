import { StepBuildersMap } from './interfaces/Types'
import { SimulationSteps } from '@summerfi/sdk/orders'
import { PullTokenBuilder } from './builder'

// TODO: remove the Partial when all the builders are implemented
export const StepBuilders: Partial<StepBuildersMap> = {
  [SimulationSteps.PullToken]: PullTokenBuilder,
}
