import { steps } from '@summerfi/sdk-common/simulation'
import type { StepOutputProcessor } from '~swap-service/interfaces/steps'

export const pullTokenOutputProcessor: StepOutputProcessor<steps.PullTokenStep> = async (step) => {
  return {
    ...step,
    outputs: undefined,
  }
}
