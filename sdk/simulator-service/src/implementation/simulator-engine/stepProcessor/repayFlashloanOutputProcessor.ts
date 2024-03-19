import { steps } from '@summerfi/sdk-common/simulation'
import { StepOutputProcessor } from '../../../interfaces/steps'

export const repayFlashloanOutputProcessor: StepOutputProcessor<steps.RepayFlashloan> = async (
  step,
) => {
  return {
    ...step,
    outputs: undefined,
  }
}
