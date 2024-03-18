import { steps, getValueFromReference } from '@summerfi/sdk-common/simulation'
import { ActionNames } from '@summerfi/deployment-types'

import { SparkBorrowAction, SparkDepositAction } from '../actions'
import { ActionBuilder } from '@summerfi/order-planner-common/builders'

export const SparkDepositBorrowActionList: ActionNames[] = ['SparkDeposit', 'SparkBorrow']

export const SparkDepositBorrowActionBuilder: ActionBuilder<steps.DepositBorrowStep> = async (
  params,
): Promise<void> => {
  const { context, positionsManager, step } = params

  context.addActionCall({
    step: params.step,
    action: new SparkDepositAction(),
    arguments: {
      depositAmount: getValueFromReference(step.inputs.depositAmount),
      sumAmounts: false,
      setAsCollateral: true,
    },
    connectedInputs: {},
    connectedOutputs: {
      depositAmount: 'depositedAmount',
    },
  })

  context.addActionCall({
    step: step,
    action: new SparkBorrowAction(),
    arguments: {
      borrowAmount: getValueFromReference(step.inputs.borrowAmount),
      borrowTo: positionsManager.address,
    },
    connectedInputs: {},
    connectedOutputs: {
      borrowAmount: 'borrowedAmount',
    },
  })
}
