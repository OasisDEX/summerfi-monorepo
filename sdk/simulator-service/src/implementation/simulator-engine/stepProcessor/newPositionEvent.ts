import { steps } from '@summerfi/sdk-common/simulation'
import type { StepOutputProcessor } from '../../../interfaces/steps'

export const newPositionEventProcessor: StepOutputProcessor<steps.NewPositionEventStep> = async (
  step,
) => {
  return {
    ...step,
    outputs: undefined,
  }
}
