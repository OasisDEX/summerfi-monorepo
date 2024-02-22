import { StepBuildersMap } from './interfaces/Types'
import { SimulationSteps } from '@summerfi/sdk-common/orders'
import { PullTokenBuilder, PaybackFlashloanBuilder, SwapBuilder } from './builders'
import { FlashloanBuilder } from './builders/FlashloanActionBuilder'

// TODO: remove the Partial when all the builders are implemented
export const StepBuilders: Partial<StepBuildersMap> = {
  [SimulationSteps.PullToken]: PullTokenBuilder,
  [SimulationSteps.Flashloan]: FlashloanBuilder,
  [SimulationSteps.Swap]: SwapBuilder,
  [SimulationSteps.PaybackFlashloan]: PaybackFlashloanBuilder,
}
