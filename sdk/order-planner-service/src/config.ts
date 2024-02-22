import { SimulationSteps } from '@summerfi/sdk-common/orders'
import {
  PullTokenActionBuilder,
  PaybackFlashloanActionBuilder,
  SwapActionBuilder,
  FlashloanActionBuilder,
  StepBuildersMap,
} from './builders'

// TODO: remove the Partial when all the builders are implemented
export const StepBuilders: Partial<StepBuildersMap> = {
  [SimulationSteps.PullToken]: PullTokenActionBuilder,
  [SimulationSteps.Flashloan]: FlashloanActionBuilder,
  [SimulationSteps.Swap]: SwapActionBuilder,
  [SimulationSteps.PaybackFlashloan]: PaybackFlashloanActionBuilder,
}
