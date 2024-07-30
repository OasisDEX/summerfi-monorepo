import { DMAStepOutputProcessor } from '../../types/DMAStepOutputProcessor'
import { ReturnFundsStep } from '../DMASimulatorSteps'

export const returnFundsOutputProcessor: DMAStepOutputProcessor<ReturnFundsStep> = async (step) => {
  return {
    ...step,
    outputs: undefined,
  }
}
