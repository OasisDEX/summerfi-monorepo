import { PaybackWithdrawStep } from '@summerfi/sdk-common/orders'
import { ActionBuilder } from '@summerfi/order-planner-common/builders'
import { ActionNames } from '@summerfi/deployment-types'
import { MakerPaybackAction, MakerWithdrawAction } from '~protocolplugins/maker'

export const MakerPaybackWithdrawActionList: ActionNames[] = ['MakerPayback', 'MakerWithdraw']

export const MakerPaybackWithdrawActionBuilder: ActionBuilder<PaybackWithdrawStep> = (
  params,
): void => {
  const { context, user, step } = params

  const debtAmountBN = step.inputs.position.debtAmount.toBN()
  const paybackAmountBN = step.inputs.paybackAmount.toBN()
  const paybackAll: boolean = paybackAmountBN.gte(debtAmountBN)

  context.addActionCall({
    step: params.step,
    action: new MakerPaybackAction(),
    arguments: {
      pool: step.inputs.position.pool,
      userAddress: user.wallet.address,
      amount: step.inputs.paybackAmount,
      paybackAll: paybackAll,
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
      amount: step.inputs.withdrawAmount,
    },
    connectedInputs: {},
    connectedOutputs: {
      withdrawAmount: 'amountWithdrawn',
    },
  })
}
