import {
  steps,
  getValueFromReference,
  TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'
import { ActionNames } from '@summerfi/deployment-types'

import { SparkBorrowAction } from '../actions/SparkBorrowAction'
import { SparkDepositAction } from '../actions/SparkDepositAction'
import { IAddress } from '@summerfi/sdk-common/common'
import { ActionBuilder, ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { SetApprovalAction } from '../../common'
import { getContractAddress } from '../../utils/GetContractAddress'

export const SparkDepositBorrowActionList: ActionNames[] = ['SparkDeposit', 'SparkBorrow']

async function getBorrowTargetAddress(
  params: ActionBuilderParams<steps.DepositBorrowStep>,
): Promise<IAddress> {
  const { user, step, positionsManager, addressBookManager } = params
  if (step.inputs.borrowTargetType === TokenTransferTargetType.PositionsManager) {
    return positionsManager.address
  }

  return getContractAddress({
    addressBookManager,
    chainInfo: user.chainInfo,
    contractName: 'OperationExecutor',
  })
}

export const SparkDepositBorrowActionBuilder: ActionBuilder<steps.DepositBorrowStep> = async (
  params,
): Promise<void> => {
  const { context, user, step, addressBookManager } = params

  const sparkLendingPoolAddress = await getContractAddress({
    addressBookManager,
    chainInfo: user.chainInfo,
    contractName: 'SparkLendingPool',
  })

  context.addActionCall({
    step: step,
    action: new SetApprovalAction(),
    arguments: {
      approvalAmount: getValueFromReference(step.inputs.depositAmount),
      delegate: sparkLendingPoolAddress,
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
    connectedInputs: {
      depositAmount: 'amountToDeposit',
    },
    connectedOutputs: {
      depositAmount: 'depositedAmount',
    },
  })

  const borrowAmount = getValueFromReference(step.inputs.borrowAmount)

  if (!borrowAmount.toBN().isZero()) {
    context.addActionCall({
      step: step,
      action: new SparkBorrowAction(),
      arguments: {
        borrowAmount: borrowAmount,
        borrowTo: await getBorrowTargetAddress(params),
      },
      connectedInputs: {},
      connectedOutputs: {
        borrowAmount: 'borrowedAmount',
      },
    })
  }
}
