import { steps } from '@summerfi/sdk-common/simulation'
import type { StepOutputProcessor } from '../../../interfaces/steps'

export const newPositionEventProcessor: StepOutputProcessor<steps.NewPositionEvent> = async (
  step,
) => {
  return {
    ...step,
    outputs: undefined,
  }
}
