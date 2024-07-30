import { DMAStepOutputProcessor } from '../../types/DMAStepOutputProcessor'
import { SkippedStep } from '../DMASimulatorSteps'

export const skippedStepOutputProcessor: DMAStepOutputProcessor<SkippedStep> = async (step) => {
  return {
    ...step,
    outputs: undefined,
  }
}
