import { SimulationStepsEnum } from './SimulationStepsEnum'
import { Step } from './Step'

/**
 * Simulation step with the output attribute removed, used
 * when callig the output processor function for a step
 */
export type StepsWithoutOutputs<
  StepsEnum extends SimulationStepsEnum,
  Steps extends Step<StepsEnum[keyof StepsEnum], unknown, unknown>,
> = Omit<Steps, 'outputs'>
