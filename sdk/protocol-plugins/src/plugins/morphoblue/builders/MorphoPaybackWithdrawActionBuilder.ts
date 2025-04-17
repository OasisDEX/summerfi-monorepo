import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { getValueFromReference, steps } from '@summerfi/sdk-common'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'
import { SetApprovalAction } from '../../common/actions/SetApprovalAction'
import { MorphoPaybackAction } from '../actions/MorphoPaybackAction'
import { MorphoWithdrawAction } from '../actions/MorphoWithdrawAction'
import { isMorphoLendingPool } from '../interfaces/IMorphoLendingPool'

export class MorphoPaybackWithdrawActionBuilder extends BaseActionBuilder<steps.PaybackWithdrawStep> {
  readonly actions: ActionBuilderUsedAction[] = [
    { action: SetApprovalAction, isOptionalTags: ['paybackAmount'] },
    { action: MorphoPaybackAction, isOptionalTags: ['paybackAmount'] },
    { action: MorphoWithdrawAction },
  ]

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
      skip: paybackAmount.isZero(),
    })

    context.addActionCall({
      step: params.step,
      action: new MorphoPaybackAction(),
      arguments: {
        morphoLendingPool: step.inputs.position.pool,
        amount: getValueFromReference(step.inputs.paybackAmount),
        onBehalf: positionsManager.address,
        paybackAll: paybackAmount.isGreaterOrEqualThan(step.inputs.position.debtAmount),
      },
      connectedInputs: {
        paybackAmount: 'amount',
      },
      connectedOutputs: {
        paybackAmount: 'paybackedAmount',
      },
      skip: paybackAmount.isZero(),
    })

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
