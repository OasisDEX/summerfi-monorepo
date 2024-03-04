import { steps } from '@summerfi/sdk-common/simulation'
import type { StepOutputProcessor } from '~swap-service/interfaces/steps'

export const returnFundsOutputProcessor: StepOutputProcessor<steps.ReturnFunds> = async (step) => {
  return {
    ...step,
    outputs: undefined,
  }
}
