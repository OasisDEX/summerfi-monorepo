import { DMAStepOutputProcessor } from '../../types/DMAStepOutputProcessor'
import { ImportStep } from '../DMASimulatorSteps'

export const importPositionProcessor: DMAStepOutputProcessor<ImportStep> = async (step) => {
  return {
    ...step,
    outputs: undefined,
  }
}
