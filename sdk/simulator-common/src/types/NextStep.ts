import { Head, Where } from '../interfaces/helperTypes'
import { SimulationStepsEnum } from './SimulationStepsEnum'
import { Step } from './Step'
import { StrategyStep } from './StrategyStep'

/**
 * A helper function that returns the next step in a simulation
 */
export type NextStep<
  StepsEnum extends SimulationStepsEnum,
  SingleStep extends Readonly<StrategyStep<StepsEnum>[]>,
  Steps extends Step<StepsEnum[keyof StepsEnum], unknown, unknown>,
> = Promise<
  Omit<Where<Steps, { type: Head<SingleStep>['step'] }>, 'outputs'> & {
    name: Head<SingleStep>['name']
  }
>
