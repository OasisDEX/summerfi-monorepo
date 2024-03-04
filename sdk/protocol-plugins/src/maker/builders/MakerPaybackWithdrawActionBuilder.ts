import { getValueFromReference, steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/order-planner-common/builders'
import { ActionNames } from '@summerfi/deployment-types'
import { MakerPaybackAction } from '~protocolplugins/maker/actions/MakerPaybackAction'
import { MakerWithdrawAction } from '~protocolplugins/maker/actions/MakerWithdrawAction'

export const MakerPaybackWithdrawActionList: ActionNames[] = ['MakerPayback', 'MakerWithdraw']

export const MakerPaybackWithdrawActionBuilder: ActionBuilder<steps.PaybackWithdrawStep> = async (
  params,
): Promise<void> => {
  const { context, user, step } = params

  context.addActionCall({
    step: params.step,
    action: new MakerPaybackAction(),
    arguments: {
      pool: step.inputs.position.pool,
      userAddress: user.wallet.address,
      amount: getValueFromReference(step.inputs.paybackAmount),
      paybackAll: true, // TODO: we cannot always calculate this value because debtAmount and paybackAmount are references
    },
    connectedInputs: {},
    connectedOutputs: {
      paybackAmount: 'amountPaidBack',
    },
  })

  context.addActionCall({
    step: step,
    action: new MakerWithdrawAction(),
    arguments: {
      pool: step.inputs.position.pool,
      userAddress: user.wallet.address,
      amount: getValueFromReference(step.inputs.withdrawAmount),
    },
    connectedInputs: {},
    connectedOutputs: {
      withdrawAmount: 'amountWithdrawn',
    },
  })
}
