import { steps } from '@summerfi/sdk-common/simulation'
import type { StepOutputProcessor } from '../../../interfaces/steps'

export const repayFlashloanOutputProcessor: StepOutputProcessor<steps.RepayFlashloanStep> = async (
  step,
) => {
  return {
    ...step,
    outputs: undefined,
  }
}
