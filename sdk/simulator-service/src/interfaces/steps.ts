import { SimulationStrategy, ValueReference, steps } from "@summerfi/sdk-common/simulation";
import { EmptyArray, Where } from "./helperTypes";
import { SimulationState } from "./simulation";

export type StepOutputProcessor<T extends steps.Steps> = (step: Omit<T, 'outputs'>) => Promise<T>;
export type StepOutputProcessors = {
    [Type in steps.Steps['type']]: StepOutputProcessor<Where<steps.Steps, { type: Type; }>>;
};
export type StepsWithouOutputs = Omit<steps.Steps, 'outputs'>
export type StateReducer<T extends steps.Steps> = (step: T, state: SimulationState) => SimulationState
export type StateReducers = {
    [Type in steps.Steps['type']]: StateReducer<Where<steps.Steps, { type: Type; }>>;
};

export type NextFunction<Schema extends SimulationStrategy, Name extends string = string> = Schema extends EmptyArray 
  ? never 
  : (ctx: {state: SimulationState, getReference: (path: [string, string]) => ValueReference<any>}) => Promise<Omit<Where<steps.Steps, { type: Schema[0]['step'], name: Name }>, 'outputs'>>;
