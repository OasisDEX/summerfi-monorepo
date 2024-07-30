import { DMAStepOutputProcessor } from '../../types/DMAStepOutputProcessor'
import { FlashloanStep } from '../DMASimulatorSteps'

export const flashloanOutputProcessor: DMAStepOutputProcessor<FlashloanStep> = async (step) => {
  return {
    ...step,
    outputs: undefined,
  }
}
