import { Head, Where } from '../interfaces/helperTypes'
import { SimulationStepsEnum } from './SimulationStepsEnum'
import { Step } from './Step'
import { StrategyStep } from './StrategyStep'

/**
 * A helper function to extract a processed step from the strategy
 */
export type ProccessedStep<
  StepsEnum extends SimulationStepsEnum,
  Steps extends Step<StepsEnum[keyof StepsEnum], unknown, unknown>,
  Strategy extends Readonly<StrategyStep<StepsEnum>[]>,
> = {
  name: Head<Strategy>['name']
  step: Where<Steps, { type: Head<Strategy>['step'] }>
}
