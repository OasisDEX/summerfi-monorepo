import { DMAStepOutputProcessor } from '../../types/DMAStepOutputProcessor'
import { PullTokenStep } from '../DMASimulatorSteps'

export const pullTokenOutputProcessor: DMAStepOutputProcessor<PullTokenStep> = async (step) => {
  return {
    ...step,
    outputs: undefined,
  }
}
