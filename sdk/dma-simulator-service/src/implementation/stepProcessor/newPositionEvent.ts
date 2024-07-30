import { DMAStepOutputProcessor } from '../../types/DMAStepOutputProcessor'
import { NewPositionEventStep } from '../DMASimulatorSteps'

export const newPositionEventProcessor: DMAStepOutputProcessor<NewPositionEventStep> = async (
  step,
) => {
  return {
    ...step,
    outputs: undefined,
  }
}
