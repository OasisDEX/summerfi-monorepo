import { DMAStepOutputProcessor } from '../../types/DMAStepOutputProcessor'
import { RepayFlashloanStep } from '../DMASimulatorSteps'

export const repayFlashloanOutputProcessor: DMAStepOutputProcessor<RepayFlashloanStep> = async (
  step,
) => {
  return {
    ...step,
    outputs: undefined,
  }
}
