import { steps } from '@summerfi/sdk-common'
import type { StepOutputProcessor } from '../../../interfaces/steps'

export const pullTokenOutputProcessor: StepOutputProcessor<steps.PullTokenStep> = async (step) => {
  return {
    ...step,
    outputs: undefined,
  }
}
