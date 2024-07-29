import { SimulationStepsEnum } from './SimulationStepsEnum'
import { Step } from './Step'
import { StepsWithoutOutputs } from './StepsWithoutOutputs'

/**
 * Definition for the output processor for a step
 *
 * An output processor takes care of genereting the outputs for a step
 */
export type StepOutputProcessor<
  StepsEnum extends SimulationStepsEnum,
  Steps extends Step<StepsEnum[keyof StepsEnum], unknown, unknown>,
  SingleStep extends Steps,
> = (step: StepsWithoutOutputs<StepsEnum, Steps>) => Promise<SingleStep>
