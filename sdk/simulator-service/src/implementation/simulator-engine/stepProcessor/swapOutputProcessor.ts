import { steps } from '@summerfi/sdk-common/simulation'
import type { StepOutputProcessor } from '../../../interfaces/steps'

export const swapOutputProcessor: StepOutputProcessor<steps.SwapStep> = async (step) => {
  return {
    ...step,
    outputs: {
      receivedAmount: step.inputs.toTokenAmount,
    },
  }
}
