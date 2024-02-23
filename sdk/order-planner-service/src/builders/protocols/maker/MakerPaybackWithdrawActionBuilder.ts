import { PaybackWithdrawStep } from '@summerfi/sdk-common/orders'
import { ActionBuilder } from '~orderplanner/builders'
import { ActionNames } from '@summerfi/deployment-types'
import { MakerPaybackAction, MakerWithdrawAction } from '~orderplanner/actions'
import { TokenAmount } from '@summerfi/sdk-common/common'

export const PullTokenActionList: ActionNames[] = ['MakerDeposit', 'MakerGenerate']

export const MakerPaybackWithdrawActionBuilder: ActionBuilder<PaybackWithdrawStep> = (
  params,
): void => {
  const { context, user, step } = params

  const debtAmount: TokenAmount = step.inputs.position.debtAmount.toBN()
  const paybackAmount: TokenAmount = step.inputs.paybackAmount.toBN()
  const paybackAll: boolean = paybackAmount.toBN().gte(debtAmount.toBN())

  context.addActionCall({
    step: params.step,
    action: new MakerPaybackAction(),
    arguments: {
      pool: step.inputs.position.pool,
      userAddress: user.wallet.address,
      amount: paybackAmount,
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
