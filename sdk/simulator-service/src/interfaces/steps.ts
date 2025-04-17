import { SimulationStrategy, ValueReference, steps, StrategyStep } from '@summerfi/sdk-common'
import { EmptyArray, Head, Where } from './helperTypes'
import { ISimulationState } from './simulation'

export type StepOutputProcessor<T extends steps.Steps> = (step: Omit<T, 'outputs'>) => Promise<T>
export type StepOutputProcessors = {
  [Type in steps.Steps['type']]: StepOutputProcessor<Where<steps.Steps, { type: Type }>>
}
export type StepsWithoutOutputs = Omit<steps.Steps, 'outputs'>
export type StateReducer<T extends steps.Steps> = (
  step: T,
  state: ISimulationState,
) => ISimulationState
export type StateReducers = {
  [Type in steps.Steps['type']]: StateReducer<Where<steps.Steps, { type: Type }>>
}

export type NextStep<S extends Readonly<StrategyStep[]>> = Promise<
  Omit<Where<steps.Steps, { type: Head<S>['step'] }>, 'outputs'> & { name: Head<S>['name'] }
>

export type StepsAdded = { name: string; step: steps.Steps }[]
export type ProccessedStep<S extends Readonly<StrategyStep[]>> = {
  name: Head<S>['name']
  step: Where<steps.Steps, { type: Head<S>['step'] }>
}

export type Paths<StepsStore extends StepsAdded> = Exclude<
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

export type GetReferencedValue<StepsStore extends StepsAdded> = <P extends Paths<StepsStore>>(
  path: P,
) => ValueReference<
  Pick<Where<StepsStore[number], { name: P[0] }>['step']['outputs'], P[1]>[keyof Pick<
    Where<StepsStore[number], { name: P[1] }>['step']['outputs'],
    P[1]
  >]
>

export type NextFunction<
  Strategy extends SimulationStrategy,
  StepsStore extends StepsAdded,
> = Strategy extends EmptyArray
  ? never
  : (ctx: {
      state: ISimulationState
      getReference: GetReferencedValue<StepsStore>
    }) => NextStep<Strategy>
