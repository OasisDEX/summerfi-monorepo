import { getValueFromReference, steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { ActionNames } from '@summerfi/deployment-types'
import { SetApprovalAction } from '../../common'
import { AaveV2PaybackAction } from '../actions/AaveV2PaybackAction'
import { AaveV2WithdrawAction } from '../actions/AaveV2WithdrawAction'
import { Address, AddressValue } from '@summerfi/sdk-common/common'

export const AaveV2PaybackWithdrawActionList: ActionNames[] = ['AavePayback', 'AaveWithdraw']

export const AaveV2PaybackWithdrawActionBuilder: ActionBuilder<steps.PaybackWithdrawStep> = async (
  params,
): Promise<void> => {
  const { context, step, positionsManager, deployment } = params

  const aaveV2LendingPool = Address.createFromEthereum({
    value: deployment.dependencies.AaveLendingPool.address as AddressValue,
  })

  context.addActionCall({
    step: step,
    action: new SetApprovalAction(),
    arguments: {
      approvalAmount: getValueFromReference(step.inputs.paybackAmount),
      delegate: aaveV2LendingPool,
      sumAmounts: false,
    },
    connectedInputs: {
      paybackAmount: 'approvalAmount',
    },
    connectedOutputs: {},
  })

  const paybackAmount = getValueFromReference(step.inputs.paybackAmount)

  context.addActionCall({
    step: params.step,
    action: new AaveV2PaybackAction(),
    arguments: {
      paybackAmount: paybackAmount,
      paybackAll: paybackAmount.toBN().gte(step.inputs.position.debtAmount.toBN()),
    },
    connectedInputs: {},
    connectedOutputs: {
      paybackAmount: 'amountPaidBack',
    },
  })

  context.addActionCall({
    step: step,
    action: new AaveV2WithdrawAction(),
    arguments: {
      withdrawAmount: getValueFromReference(step.inputs.withdrawAmount),
      withdrawTo: positionsManager.address,
    },
    connectedInputs: {},
    connectedOutputs: {
      withdrawAmount: 'amountWithdrawn',
    },
  })
}
