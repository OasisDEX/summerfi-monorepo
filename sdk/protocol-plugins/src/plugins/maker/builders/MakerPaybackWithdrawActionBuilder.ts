import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { getValueFromReference, steps } from '@summerfi/sdk-common'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'
import { MakerPaybackAction } from '../actions/MakerPaybackAction'
import { MakerWithdrawAction } from '../actions/MakerWithdrawAction'
import { isMakerLendingPoolId } from '../interfaces/IMakerLendingPoolId'
import { MakerIlkToJoinMap } from '../types/MakerIlkToJoinMap'

export class MakerPaybackWithdrawActionBuilder extends BaseActionBuilder<steps.PaybackWithdrawStep> {
  readonly actions: ActionBuilderUsedAction[] = [
    { action: MakerPaybackAction, isOptionalTags: ['paybackAmount'] },
    { action: MakerWithdrawAction },
  ]

  async build(params: ActionBuilderParams<steps.PaybackWithdrawStep>): Promise<void> {
    const { context, user, positionsManager, step, addressBookManager } = params

    if (!isMakerLendingPoolId(step.inputs.position.pool.id)) {
      throw new Error('Invalid Maker lending pool id')
    }

    const ilkType = step.inputs.position.pool.id.ilkType

    const joinName = MakerIlkToJoinMap[ilkType]
    const joinAddress = await this._getContractAddress({
      addressBookManager,
      chainInfo: user.chainInfo,
      contractName: joinName,
    })

    const paybackAmount = getValueFromReference(step.inputs.paybackAmount)

    context.addActionCall({
      step: params.step,
      action: new MakerPaybackAction(),
      arguments: {
        position: step.inputs.position,
        positionsManager: positionsManager,
        amount: getValueFromReference(step.inputs.paybackAmount),
        paybackAll: paybackAmount.isGreaterOrEqualThan(step.inputs.position.debtAmount),
      },
      connectedInputs: {},
      connectedOutputs: {
        paybackAmount: 'amountPaidBack',
      },
      skip: paybackAmount.isZero(),
    })

    context.addActionCall({
      step: step,
      action: new MakerWithdrawAction(),
      arguments: {
        position: step.inputs.position,
        positionsManager: positionsManager,
        amount: step.inputs.withdrawAmount,
        joinAddress: joinAddress,
      },
      connectedInputs: {},
      connectedOutputs: {
        withdrawAmount: 'amountWithdrawn',
      },
    })
  }
}
