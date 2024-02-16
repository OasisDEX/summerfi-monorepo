import { StepBuildersMap } from './interfaces/Types'
import { SimulationSteps } from '@summerfi/sdk/orders'
import { PullTokenBuilder } from './builders'

export const StepBuilders: StepBuildersMap = {
  [SimulationSteps.PullToken]: PullTokenBuilder,
}
