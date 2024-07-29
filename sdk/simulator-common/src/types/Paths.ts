import { SimulationStepsEnum } from './SimulationStepsEnum'
import { Step } from './Step'
import { StepsAdded } from './StepsAdded'

/**
 * Retrieves the paths of the outputs of the steps
 *
 * This is used to reference the output values by path in the simulation
 */
export type Paths<
  StepsEnum extends SimulationStepsEnum,
  Steps extends Step<StepsEnum[keyof StepsEnum], unknown, unknown>,
  StepsStore extends StepsAdded<StepsEnum, Steps>,
> = Exclude<
  {
    [Step in keyof StepsStore]: {
      [OutputKey in keyof StepsStore[Step]['step']['outputs']]: [
        StepsStore[Step]['name'],
        OutputKey,
      ]
    }[keyof StepsStore[Step]['step']['outputs']]
  }[number],
  [string, never]
>
