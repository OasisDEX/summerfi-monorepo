import { ISimulationState } from '../interfaces/ISimulationState'
import { Where } from '../interfaces/helperTypes'
import { SimulationStepsEnum } from './SimulationStepsEnum'
import { StateReducer } from './StateReducer'
import { Step } from './Step'

/**
 * Definition for the state reducers for all steps
 *
 * A state reducer takes care of reducing the state for a step
 *
 * This defines a map for all state reducers for all the steps
 */
export type StateReducers<
  StepsEnum extends SimulationStepsEnum,
  Steps extends Step<StepsEnum[keyof StepsEnum], unknown, unknown>,
  SimulationState extends ISimulationState<StepsEnum, Steps>,
> = {
  [Type in Steps['type']]: StateReducer<
    StepsEnum,
    Steps,
    Where<Steps, { type: Type }>,
    SimulationState
  >
}
