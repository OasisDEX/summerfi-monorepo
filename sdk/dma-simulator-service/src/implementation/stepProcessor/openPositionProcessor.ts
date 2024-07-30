import { DMAStepOutputProcessor } from '../../types/DMAStepOutputProcessor'
import { newEmptyPositionFromPool } from '../../utils/PositionUtils'
import { OpenPosition } from '../DMASimulatorSteps'

export const openPositionProcessor: DMAStepOutputProcessor<OpenPosition> = async (step) => {
  return {
    ...step,
    outputs: {
      position: newEmptyPositionFromPool(step.inputs.pool),
    },
  }
}
