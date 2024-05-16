import { getValueFromReference, steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { isMorphoLendingPool } from '../interfaces/IMorphoLendingPool'
import { MorphoPaybackAction, MorphoWithdrawAction } from '../actions'
import { SetApprovalAction } from '../../common'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class MorphoPaybackWithdrawActionBuilder extends BaseActionBuilder<steps.PaybackWithdrawStep> {
  async build(params: ActionBuilderParams<steps.PaybackWithdrawStep>): Promise<void> {
    const { context, positionsManager, step, addressBookManager, user } = params

    if (!isMorphoLendingPool(step.inputs.position.pool)) {
      throw new Error('Invalid Morpho lending pool id')
    }

    const morphoBlueAddress = await this._getContractAddress({
      addressBookManager,
      chainInfo: user.chainInfo,
      contractName: 'MorphoBlue',
    })

    const paybackAmount = getValueFromReference(step.inputs.paybackAmount)

    if (!paybackAmount.toBN().isZero()) {
      context.addActionCall({
        step: params.step,
        action: new SetApprovalAction(),
        arguments: {
          approvalAmount: getValueFromReference(step.inputs.paybackAmount),
          delegate: morphoBlueAddress,
          sumAmounts: false,
        },
        connectedInputs: {
          paybackAmount: 'approvalAmount',
        },
        connectedOutputs: {},
      })

      context.addActionCall({
        step: params.step,
        action: new MorphoPaybackAction(),
        arguments: {
          morphoLendingPool: step.inputs.position.pool,
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
        morphoLendingPool: step.inputs.position.pool,
        amount: step.inputs.withdrawAmount,
        to: positionsManager.address,
      },
      connectedInputs: {},
      connectedOutputs: {
        withdrawAmount: 'withdrawnAmount',
      },
    })
  }
}
