import { steps } from '@summerfi/sdk-common/simulation'
import type { StepOutputProcessor } from '../../../interfaces/steps'

export const openPositionProcessor: StepOutputProcessor<steps.OpenPosition> = async (step) => {
  return {
    ...step,
    outputs: undefined,
  }
}
