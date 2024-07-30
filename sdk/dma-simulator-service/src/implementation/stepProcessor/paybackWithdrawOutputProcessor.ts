import { getValueFromReference } from '@summerfi/simulator-common/interfaces'
import { DMAStepOutputProcessor } from '../../types/DMAStepOutputProcessor'
import { PaybackWithdrawStep } from '../DMASimulatorSteps'

export const paybackWithdrawOutputProcessor: DMAStepOutputProcessor<PaybackWithdrawStep> = async (
  step,
) => {
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
