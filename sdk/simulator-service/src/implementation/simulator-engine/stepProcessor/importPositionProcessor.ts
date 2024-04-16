import { steps } from '@summerfi/sdk-common/simulation'
import type { StepOutputProcessor } from '../../../interfaces/steps'

export const importPositionProcessor: StepOutputProcessor<steps.ImportStep> = async (step) => {
  return {
    ...step,
    outputs: undefined,
  }
}
