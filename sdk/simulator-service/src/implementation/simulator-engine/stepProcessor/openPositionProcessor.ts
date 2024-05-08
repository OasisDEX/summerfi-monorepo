import { steps } from '@summerfi/sdk-common/simulation'
import type { StepOutputProcessor } from '../../../interfaces/steps'
import { newEmptyPositionFromPool } from '@summerfi/sdk-common/common/utils'

export const openPositionProcessor: StepOutputProcessor<steps.OpenPosition> = async (step) => {
  return {
    ...step,
    outputs: {
      position: newEmptyPositionFromPool(step.inputs.pool)
    },
  }
}
