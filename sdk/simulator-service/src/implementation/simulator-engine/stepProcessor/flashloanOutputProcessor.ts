import { steps } from '@summerfi/sdk-common/simulation'
import type { StepOutputProcessor } from '~simulator-service/interfaces/steps'

export const flashloanOutputProcessor: StepOutputProcessor<steps.FlashloanStep> = async (step) => {
  return {
    ...step,
    outputs: undefined,
  }
}
