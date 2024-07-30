import { getValueFromReference } from '@summerfi/simulator-common/interfaces'
import { DMAStepOutputProcessor } from '../../types/DMAStepOutputProcessor'
import { DepositBorrowStep } from '../DMASimulatorSteps'

export const depositBorrowOutputProcessor: DMAStepOutputProcessor<DepositBorrowStep> = async (
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
