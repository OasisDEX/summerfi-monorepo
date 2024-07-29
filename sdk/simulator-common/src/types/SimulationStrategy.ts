import { SimulationStepsEnum } from './SimulationStepsEnum'
import { StrategyStep } from './StrategyStep'

/**
 * A simulation strategy is composed of a sequential
 * list of steps that are executed in order
 */
export type SimulationStrategy<StepsEnum extends SimulationStepsEnum> =
  readonly StrategyStep<StepsEnum>[]
