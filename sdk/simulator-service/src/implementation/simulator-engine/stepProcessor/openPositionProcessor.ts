import { steps, newEmptyPositionFromPool } from '@summerfi/sdk-common'
import type { StepOutputProcessor } from '../../../interfaces/steps'

export const openPositionProcessor: StepOutputProcessor<steps.OpenPosition> = async (step) => {
  return {
    ...step,
    outputs: {
      position: newEmptyPositionFromPool(step.inputs.pool),
    },
  }
}
