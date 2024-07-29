import { ISimulationState } from '../interfaces/ISimulationState'
import { SimulationStepsEnum } from './SimulationStepsEnum'
import { Step } from './Step'

/**
 * Reducer function for the simulation state for a single step
 *
 * The reducer function takes the current state and reduces it to the new state
 * for the given step
 */
export type StateReducer<
  StepsEnum extends SimulationStepsEnum,
  Steps extends Step<StepsEnum[keyof StepsEnum], unknown, unknown>,
  SingleStep extends Steps,
  SimulationState extends ISimulationState<StepsEnum, Steps>,
> = (step: SingleStep, state: SimulationState) => SimulationState
