import { Where } from '../interfaces/helperTypes'
import { SimulationStepsEnum } from './SimulationStepsEnum'
import { Step } from './Step'
import { StepOutputProcessor } from './StepOutputProcessor'

/**
 * Definition for the output processors for all steps
 *
 * An output processor takes care of genereting the outputs for a step
 *
 * This defines a map for all output processors for all the steps
 */
export type StepOutputProcessors<
  StepsEnum extends SimulationStepsEnum,
  Steps extends Step<StepsEnum[keyof StepsEnum], unknown, unknown>,
> = {
  [Type in Steps['type']]: StepOutputProcessor<StepsEnum, Steps, Where<Steps, { type: Type }>>
}
