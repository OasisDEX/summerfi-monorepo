import { steps } from '@summerfi/sdk-common'
import { getValueFromReference } from '../../utils'
import type { StepOutputProcessor } from '../../../interfaces/steps'

export const depositBorrowOutputProcessor: StepOutputProcessor<steps.DepositBorrowStep> = async (
  step,
) => {
  const depositAmount = step.inputs.additionalDeposit
    ? getValueFromReference(step.inputs.additionalDeposit).add(
        getValueFromReference(step.inputs.depositAmount),
      )
    : getValueFromReference(step.inputs.depositAmount)

  return {
    ...step,
    outputs: {
      depositAmount: depositAmount,
      borrowAmount: getValueFromReference(step.inputs.borrowAmount),
    },
  }
}
