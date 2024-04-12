import { steps, getValueFromReference } from '@summerfi/sdk-common/simulation'
import { ActionNames } from '@summerfi/deployment-types'
import { getBorrowTargetAddress } from '../../../utils/get-borrow-target-address'

import { SparkBorrowAction } from '../actions/SparkBorrowAction'
import { SparkDepositAction } from '../actions/SparkDepositAction'
import { Address, AddressValue } from '@summerfi/sdk-common/common'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { SetApprovalAction } from '../../common'

export const SparkDepositBorrowActionList: ActionNames[] = ['SparkDeposit', 'SparkBorrow']

export const SparkDepositBorrowActionBuilder: ActionBuilder<steps.DepositBorrowStep> = async (
  params,
): Promise<void> => {
  const { context, step, deployment } = params

  const sparkLendingPool = Address.createFromEthereum({
    value: deployment.dependencies.SparkLendingPool.address as AddressValue,
  })

  context.addActionCall({
    step: step,
    action: new SetApprovalAction(),
    arguments: {
      approvalAmount: getValueFromReference(step.inputs.depositAmount),
      delegate: sparkLendingPool,
      sumAmounts: false,
    },
    connectedInputs: {
      depositAmount: 'approvalAmount',
    },
    connectedOutputs: {},
  })

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
      borrowTo: getBorrowTargetAddress(params),
    },
    connectedInputs: {},
    connectedOutputs: {
      borrowAmount: 'borrowedAmount',
    },
  })
}
