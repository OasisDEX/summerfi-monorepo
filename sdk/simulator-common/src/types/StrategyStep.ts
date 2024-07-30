import { SimulationStepsEnum } from './SimulationStepsEnum'

/**
 * Definition of a strategy step
 */
export interface StrategyStep<StepsEnum extends SimulationStepsEnum> {
  /** Free form name of the step */
  name: string
  /** The step type from the simulation steps enumeration */
  step: StepsEnum[keyof StepsEnum]
  /** Whether the step is optional or not */
  optional: boolean
}
