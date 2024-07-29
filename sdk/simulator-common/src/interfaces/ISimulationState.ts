import { SimulationStepsEnum } from '../types/SimulationStepsEnum'
import { Step } from '../types/Step'
import { StepsArray } from '../types/StepsArray'

/**
 * @interface ISimulationState
 * @description The state of the simulation, to be specialized by each simulator
 */
export interface ISimulationState<
  StepsEnum extends SimulationStepsEnum,
  Steps extends Step<StepsEnum[keyof StepsEnum], unknown, unknown>,
> {
  steps: StepsArray<StepsEnum, Steps>
}
