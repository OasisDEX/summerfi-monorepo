import { steps } from '@summerfi/sdk-common/simulation'
import type { StepOutputProcessor } from '~swap-service/interfaces/steps'

export const swapOutputProcessor: StepOutputProcessor<steps.SwapStep> = async (step) => {
  return {
    ...step,
    outputs: {
      recievedAmount: step.inputs.toTokenAmount,
    },
  }
}
