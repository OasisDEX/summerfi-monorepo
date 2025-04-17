import { steps } from '@summerfi/sdk-common'
import { getValueFromReference } from '../../utils'
import type { StepOutputProcessor } from '../../../interfaces/steps'

export const paybackWithdrawOutputProcessor: StepOutputProcessor<
  steps.PaybackWithdrawStep
> = async (step) => {
  const paybackAmount =
    getValueFromReference(step.inputs.paybackAmount).amount > step.inputs.position.debtAmount.amount
      ? step.inputs.position.debtAmount
      : getValueFromReference(step.inputs.paybackAmount)

  const withdrawAmount =
    getValueFromReference(step.inputs.withdrawAmount).amount >
    step.inputs.position.collateralAmount.amount
      ? step.inputs.position.collateralAmount
      : getValueFromReference(step.inputs.withdrawAmount)

  return {
    ...step,
    outputs: {
      paybackAmount: paybackAmount,
      withdrawAmount: withdrawAmount,
    },
  }
}
