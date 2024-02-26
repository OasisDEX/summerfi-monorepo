import { steps } from "@summerfi/sdk-common/simulation";
import { Where } from "./helperTypes";

export type StepOutputProcessor<T extends steps.Steps> = (step: Omit<T, 'outputs'>) => Promise<T>;
export type StepOutputProcessors = {
    [Type in steps.Steps['type']]: StepOutputProcessor<Where<steps.Steps, { type: Type; }>>;
};
export type StepsWithouOutputs = Omit<steps.Steps, 'outputs'>