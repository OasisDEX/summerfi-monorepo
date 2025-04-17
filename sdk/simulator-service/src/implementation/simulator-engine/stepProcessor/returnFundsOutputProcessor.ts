import { steps } from '@summerfi/sdk-common'
import type { StepOutputProcessor } from '../../../interfaces/steps'

export const returnFundsOutputProcessor: StepOutputProcessor<steps.ReturnFundsStep> = async (
  step,
) => {
  return {
    ...step,
    outputs: undefined,
  }
}
