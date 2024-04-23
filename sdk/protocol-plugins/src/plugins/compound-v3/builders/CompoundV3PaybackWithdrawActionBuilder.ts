import { getValueFromReference, steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { ActionNames } from '@summerfi/deployment-types'
import { CompoundV3PaybackAction } from '../actions/CompoundV3PaybackAction'
import { CompoundV3WithdrawAction } from '../actions/CompoundV3WithdrawAction'
import { isCompoundV3PoolId } from '../types'
import { SetApprovalAction } from '../../../plugins/common'

export const CompoundV3PaybackWithdrawActionList: ActionNames[] = [
  'SetApproval',
  'CompoundV3Payback',
  'CompoundV3Withdraw',
]

export const CompoundV3PaybackWithdrawActionBuilder: ActionBuilder<
  steps.PaybackWithdrawStep
> = async (params): Promise<void> => {
  const { context, step } = params

  if (!isCompoundV3PoolId(step.inputs.position.pool.poolId)) {
    throw new Error('Compound V3: Invalid pool id')
  }

  context.addActionCall({
    step: params.step,
    action: new SetApprovalAction(),
    arguments: {
      approvalAmount: getValueFromReference(step.inputs.paybackAmount),
      delegate: step.inputs.position.pool.poolId.comet,
      sumAmounts: false,
    },
    connectedInputs: {},
    connectedOutputs: {},
  })

  context.addActionCall({
    step: params.step,
    action: new CompoundV3PaybackAction(),
    arguments: {
      comet: step.inputs.position.pool.poolId.comet,
      // todo: source has to be the external position address or dpm address if it's not migration
      source: params.user.wallet.address,
      paybackAmount: getValueFromReference(step.inputs.paybackAmount),
      paybackAll: getValueFromReference(step.inputs.paybackAmount)
        .toBN()
        .gte(step.inputs.position.debtAmount.toBN()),
    },
    connectedInputs: {},
    connectedOutputs: {
      paybackAmount: 'amountPaidBack',
    },
  })
  context.addActionCall({
    step: step,
    action: new CompoundV3WithdrawAction(),
    arguments: {
      comet: step.inputs.position.pool.poolId.comet,
      source: params.user.wallet.address,
      withdrawAmount: step.inputs.withdrawAmount,
      withdrawAll: step.inputs.withdrawAmount
        .toBN()
        .gte(step.inputs.position.collateralAmount.toBN()),
    },
    connectedInputs: {},
    connectedOutputs: {
      withdrawAmount: 'amountWithdrawn',
    },
  })
}
