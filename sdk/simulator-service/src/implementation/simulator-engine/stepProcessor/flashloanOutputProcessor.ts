import { steps } from '@summerfi/sdk-common'
import type { StepOutputProcessor } from '../../../interfaces/steps'

export const flashloanOutputProcessor: StepOutputProcessor<steps.FlashloanStep> = async (step) => {
  return {
    ...step,
    outputs: undefined,
  }
}
