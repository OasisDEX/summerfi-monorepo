import { DMAStepOutputProcessor } from '../../types/DMAStepOutputProcessor'
import { SwapStep } from '../DMASimulatorSteps'

export const swapOutputProcessor: DMAStepOutputProcessor<SwapStep> = async (step) => {
  return {
    ...step,
    outputs: {
      received: step.inputs.minimumReceivedAmount,
    },
  }
}
