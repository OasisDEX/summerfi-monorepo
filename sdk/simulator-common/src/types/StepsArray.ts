import { SimulationStepsEnum } from './SimulationStepsEnum'
import { Step } from './Step'

/**
 * Array of steps for the simulation
 */
export type StepsArray<
  StepsEnum extends SimulationStepsEnum,
  Steps extends Step<StepsEnum[keyof StepsEnum], unknown, unknown>,
> = Array<Steps>
