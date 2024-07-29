import { steps } from '@summerfi/sdk-common/simulation'
import type { StepOutputProcessor } from '../../../interfaces/steps'

export const skippedStepOutputProcessor: StepOutputProcessor<steps.SkippedStep> = async (step) => {
  return {
    ...step,
    outputs: undefined,
  }
}
