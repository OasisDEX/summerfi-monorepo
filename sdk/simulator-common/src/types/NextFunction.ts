import { EmptyArray } from '../interfaces/helperTypes'
import { ISimulationState } from '../interfaces/ISimulationState'
import { GetReferencedValue } from './GetReferencedValue'
import { NextStep } from './NextStep'
import { SimulationStepsEnum } from './SimulationStepsEnum'
import { SimulationStrategy } from './SimulationStrategy'
import { Step } from './Step'
import { StepsAdded } from './StepsAdded'

/**
 * A helper function that returns the next function to be executed in the simulation
 */
export type NextFunction<
  StepsEnum extends SimulationStepsEnum,
  Strategy extends SimulationStrategy<StepsEnum>,
  Steps extends Step<StepsEnum[keyof StepsEnum], unknown, unknown>,
  StepsStore extends StepsAdded<StepsEnum, Steps>,
  SimulationState extends ISimulationState<StepsEnum, Steps>,
> = Strategy extends EmptyArray
  ? never
  : (ctx: {
      state: SimulationState
      getReference: GetReferencedValue<StepsEnum, Steps, StepsStore>
    }) => NextStep<StepsEnum, Strategy, Steps>
