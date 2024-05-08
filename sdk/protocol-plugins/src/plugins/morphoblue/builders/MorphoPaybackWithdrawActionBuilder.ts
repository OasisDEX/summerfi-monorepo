import { getValueFromReference, steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { isMorphoLendingPool } from '../interfaces/IMorphoLendingPool'
import { MorphoPaybackAction, MorphoWithdrawAction } from '../actions'

export const MorphoPaybackWithdrawActionBuilder: ActionBuilder<steps.PaybackWithdrawStep> = async (
  params,
): Promise<void> => {
  const { context, positionsManager, step } = params

  if (!isMorphoLendingPool(step.inputs.position.pool)) {
    throw new Error('Maker: Invalid pool id')
  }

  const paybackAmount = getValueFromReference(step.inputs.paybackAmount)

  if (!paybackAmount.toBN().isZero()) {
    context.addActionCall({
      step: params.step,
      action: new MorphoPaybackAction(),
      arguments: {
        morphoLendingPoolId: step.inputs.position.pool.id,
        amount: getValueFromReference(step.inputs.paybackAmount),
        onBehalf: positionsManager.address,
        paybackAll: paybackAmount.toBN().gte(step.inputs.position.debtAmount.toBN()),
      },
      connectedInputs: {
        paybackAmount: 'amount',
      },
      connectedOutputs: {
        paybackAmount: 'paybackedAmount',
      },
    })
  }

  context.addActionCall({
    step: step,
    action: new MorphoWithdrawAction(),
    arguments: {
      morphoLendingPoolId: step.inputs.position.pool.id,
      amount: step.inputs.withdrawAmount,
      to: positionsManager.address,
    },
    connectedInputs: {},
    connectedOutputs: {
      withdrawAmount: 'withdrawnAmount',
    },
  })
}
