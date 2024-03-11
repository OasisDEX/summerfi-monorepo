import { steps } from '@summerfi/sdk-common/simulation'
import type { StepOutputProcessor } from '~simulator-service/interfaces/steps'

export const swapOutputProcessor: StepOutputProcessor<steps.SwapStep> = async (step) => {
  return {
    ...step,
    outputs: {
      receivedAmount: step.inputs.toTokenAmount,
    },
  }
}
