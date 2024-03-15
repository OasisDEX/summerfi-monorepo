import { steps } from '@summerfi/sdk-common/simulation'
import { getReferencedValue } from '../../helpers'
import type { StepOutputProcessor } from '../../../interfaces/steps'

export const depositBorrowOutputProcessor: StepOutputProcessor<steps.DepositBorrowStep> = async (
  step,
) => {
  const depositAmount = step.inputs.additionalDeposit
    ? getReferencedValue(step.inputs.additionalDeposit).add(
        getReferencedValue(step.inputs.depositAmount),
      )
    : getReferencedValue(step.inputs.depositAmount)

  return {
    ...step,
    outputs: {
      depositAmount: depositAmount,
      borrowAmount: getReferencedValue(step.inputs.borrowAmount),
    },
  }
}
