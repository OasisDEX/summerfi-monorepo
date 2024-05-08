import { SimulationStrategy, ValueReference, steps } from '@summerfi/sdk-common/simulation'
import { EmptyArray, Where } from './helperTypes'
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

export type Reference = Record<string, Record<string, any>>
export type Paths<Reference> = {[StepName in keyof Reference]: [StepName, keyof Reference[StepName]]}[keyof Reference][]
export type GetTypeAtReference<Ref extends Reference, Path extends [string, string]> = Ref[Path[0]][Path[1]]

type tests = {
  Test: {
    fl: number
    name: string
  }
  Open: {
    position: number
  }
}

type paths = Paths<tests>
type testPaths = GetTypeAtReference<tests, ['Test', 'name']>

export type NextFunction<
  Schema extends SimulationStrategy,
  Name extends string = string,
  Ref extends Reference = Reference,
> = Schema extends EmptyArray
  ? never
  : (ctx: {
      state: ISimulationState
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getReference: <P extends Paths<Ref>>(path: P) => ValueReference<GetTypeAtReference<Ref, P>>
    }) => Promise<Readonly<Omit<Where<steps.Steps, { type: Schema[0]['step']; name: Name }>, 'outputs'>>>
