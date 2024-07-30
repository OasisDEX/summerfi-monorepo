import { ISimulationState } from '../interfaces/ISimulationState'
import { NextFunction } from './NextFunction'
import { SimulationStepsEnum } from './SimulationStepsEnum'
import { SimulationStrategy } from './SimulationStrategy'
import { StateReducers } from './StateReducers'
import { Step } from './Step'
import { StepOutputProcessors } from './StepOutputProcessors'
import { StepsAdded } from './StepsAdded'

/**
 * Configuration for the simulator
 *
 * This contains all the information needed to initialize the simulator for a specific domain
 */
export interface SimulatorConfig<
  StepsEnum extends SimulationStepsEnum,
  Strategy extends SimulationStrategy<StepsEnum> = SimulationStrategy<StepsEnum>,
  Steps extends Step<StepsEnum[keyof StepsEnum], unknown, unknown> = Step<
    StepsEnum[keyof StepsEnum],
    unknown,
    unknown
  >,
  AddedSteps extends StepsAdded<StepsEnum, Steps> = StepsAdded<StepsEnum, Steps>,
  SimulationState extends ISimulationState<StepsEnum, Steps> = ISimulationState<StepsEnum, Steps>,
> {
  schema: Strategy
  originalSchema?: SimulationStrategy<StepsEnum>
  outputProcessors: StepOutputProcessors<StepsEnum, Steps>
  stateReducers: StateReducers<StepsEnum, Steps, SimulationState>
  state: SimulationState
  nextArray?: Readonly<NextFunction<StepsEnum, Strategy, Steps, AddedSteps, SimulationState>[]>
}
