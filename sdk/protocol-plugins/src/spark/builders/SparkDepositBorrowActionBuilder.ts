import { DepositBorrowStep } from '@summerfi/sdk-common/orders'
import { TokenAmount } from '@summerfi/sdk-common/common'
import { ActionNames } from '@summerfi/deployment-types'

import { SparkBorrowAction, SparkDepositAction } from '~protocolplugins/spark/actions'
import { ActionBuilder } from '@summerfi/order-planner-common/builders'

export const SparkDepositBorrowActionList: ActionNames[] = ['SparkDeposit', 'SparkBorrow']

export const SparkDepositBorrowActionBuilder: ActionBuilder<DepositBorrowStep> = (params): void => {
  const { context, positionsManager, step } = params

  const depositAmount: TokenAmount = step.inputs.depositAmount
  const borrowAmount: TokenAmount = step.inputs.borrowAmount

  context.addActionCall({
    step: params.step,
    action: new SparkDepositAction(),
    arguments: {
      depositAmount: depositAmount,
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
      borrowAmount: borrowAmount,
      borrowTo: positionsManager.address.toString(),
    },
    connectedInputs: {},
    connectedOutputs: {
      borrowAmount: 'borrowedAmount',
    },
  })
}
