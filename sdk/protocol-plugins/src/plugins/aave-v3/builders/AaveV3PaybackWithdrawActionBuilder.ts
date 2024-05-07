import {
  steps,
  getValueFromReference,
  TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'
import { ActionNames } from '@summerfi/deployment-types'

import { Address, AddressValue } from '@summerfi/sdk-common/common'
import { ActionBuilder, ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { SetApprovalAction } from '../../common'
import { AaveV3WithdrawAction } from '../actions/AaveV3WithdrawAction'
import { AaveV3PaybackAction } from '../actions/AaveV3PaybackAction'

export const AaveV3PaybackWithdrawActionList: ActionNames[] = ['AaveV3Payback', 'AaveV3Withdraw']

function getWithdrawTargetAddress(params: ActionBuilderParams<steps.PaybackWithdrawStep>): Address {
  const { step, positionsManager, deployment } = params

  return step.inputs.withdrawTargetType === TokenTransferTargetType.PositionsManager
    ? positionsManager.address
    : Address.createFromEthereum({
        value: deployment.contracts.OperationExecutor.address as AddressValue,
      })
}

export const AaveV3PaybackWithdrawActionBuilder: ActionBuilder<steps.PaybackWithdrawStep> = async (
  params,
): Promise<void> => {
  const { context, step, deployment } = params

  const sparkLendingPool = Address.createFromEthereum({
    value: deployment.dependencies.SparkLendingPool.address as AddressValue,
  })

  const paybackAmount = getValueFromReference(step.inputs.paybackAmount)

  if (!paybackAmount.toBN().isZero()) {
    context.addActionCall({
      step: step,
      action: new SetApprovalAction(),
      arguments: {
        approvalAmount: getValueFromReference(step.inputs.paybackAmount),
        delegate: sparkLendingPool,
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
        paybackAll: getValueFromReference(step.inputs.paybackAmount).toBN().gt(step.inputs.position.debtAmount.toBN()),
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
        withdrawTo: getWithdrawTargetAddress(params),
      },
      connectedInputs: {},
      connectedOutputs: {
        withdrawAmount: 'withdrawnAmount',
      },
    })
  }
}
