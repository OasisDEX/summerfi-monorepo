import {
  steps,
  getValueFromReference,
  TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'
import { ActionNames } from '@summerfi/deployment-types'

import { IAddress } from '@summerfi/sdk-common/common'
import { ActionBuilder, ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { SetApprovalAction } from '../../common'
import { AaveV3WithdrawAction } from '../actions/AaveV3WithdrawAction'
import { AaveV3PaybackAction } from '../actions/AaveV3PaybackAction'
import { getContractAddress } from '../../utils/GetContractAddress'
import { isAaveV3LendingPool } from '../interfaces/IAaveV3LendingPool'

export const AaveV3PaybackWithdrawActionList: ActionNames[] = ['AaveV3Payback', 'AaveV3Withdraw']

async function getWithdrawTargetAddress(
  params: ActionBuilderParams<steps.PaybackWithdrawStep>,
): Promise<IAddress> {
  const { user, step, positionsManager, addressBookManager } = params
  if (step.inputs.withdrawTargetType === TokenTransferTargetType.PositionsManager) {
    return positionsManager.address
  }

  return getContractAddress({
    addressBookManager,
    chainInfo: user.chainInfo,
    contractName: 'OperationExecutor',
  })
}

export const AaveV3PaybackWithdrawActionBuilder: ActionBuilder<steps.PaybackWithdrawStep> = async (
  params,
): Promise<void> => {
  const { context, step, addressBookManager, user } = params

  if (!isAaveV3LendingPool(step.inputs.position.pool)) {
    throw new Error('Invalid AaveV3 lending pool')
  }

  const sparkLendingPoolAddress = await getContractAddress({
    addressBookManager,
    chainInfo: user.chainInfo,
    contractName: 'SparkLendingPool',
  })

  const paybackAmount = getValueFromReference(step.inputs.paybackAmount)

  if (!paybackAmount.toBN().isZero()) {
    context.addActionCall({
      step: step,
      action: new SetApprovalAction(),
      arguments: {
        approvalAmount: getValueFromReference(step.inputs.paybackAmount),
        delegate: sparkLendingPoolAddress,
        sumAmounts: false,
      },
      connectedInputs: {
        paybackAmount: 'approvalAmount',
      },
      connectedOutputs: {},
    })

    context.addActionCall({
      step: params.step,
      action: new AaveV3PaybackAction(),
      arguments: {
        paybackAmount: getValueFromReference(step.inputs.paybackAmount),
        paybackAll: getValueFromReference(step.inputs.paybackAmount)
          .toBN()
          .gt(step.inputs.position.debtAmount.toBN()),
      },
      connectedInputs: {},
      connectedOutputs: {
        paybackAmount: 'paybackedAmount',
      },
    })
  }

  const withdrawAmount = getValueFromReference(step.inputs.withdrawAmount)

  if (!withdrawAmount.toBN().isZero()) {
    context.addActionCall({
      step: step,
      action: new AaveV3WithdrawAction(),
      arguments: {
        withdrawAmount: withdrawAmount,
        withdrawTo: await getWithdrawTargetAddress(params),
      },
      connectedInputs: {},
      connectedOutputs: {
        withdrawAmount: 'withdrawnAmount',
      },
    })
  }
}
