import { steps } from '@summerfi/sdk-common/simulation'
import { getReferencedValue } from '../../helpers'
import type { StepOutputProcessor } from '../../../interfaces/steps'

export const paybackWithdrawOutputProcessor: StepOutputProcessor<
  steps.PaybackWithdrawStep
> = async (step) => {
  const paybackAmount =
    getReferencedValue(step.inputs.paybackAmount).amount > step.inputs.position.debtAmount.amount
      ? step.inputs.position.debtAmount
      : getReferencedValue(step.inputs.paybackAmount)

  const withdrawAmount =
    getReferencedValue(step.inputs.withdrawAmount).amount >
    step.inputs.position.collateralAmount.amount
      ? step.inputs.position.collateralAmount
      : getReferencedValue(step.inputs.withdrawAmount)

  return {
    ...step,
    outputs: {
      paybackAmount: paybackAmount,
      withdrawAmount: withdrawAmount,
    },
  }
}
