import { SimulationStepsEnum } from './SimulationStepsEnum'
import { Step } from './Step'

/**
 * Type for the steps added to the simulation, in generic form
 * to support different sets of steps
 */
export type StepsAdded<
  StepsEnum extends SimulationStepsEnum,
  Steps extends Step<StepsEnum[keyof StepsEnum], unknown, unknown>,
> = {
  /** Free form name of the step */
  name: string
  /** The step itself */
  step: Steps
}[]
