import { SimulationSteps } from '@summerfi/sdk-common/orders'
import {
  PullTokenActionBuilder,
  PaybackFlashloanActionBuilder,
  SwapActionBuilder,
  FlashloanActionBuilder,
  ActionBuildersMap,
} from '~orderplanner/builders'

// TODO: remove the Partial when all the builders are implemented
export const StepBuilders: Partial<ActionBuildersMap> = {
  [SimulationSteps.PullToken]: PullTokenActionBuilder,
  [SimulationSteps.Flashloan]: FlashloanActionBuilder,
  [SimulationSteps.Swap]: SwapActionBuilder,
  [SimulationSteps.PaybackFlashloan]: PaybackFlashloanActionBuilder,
}
