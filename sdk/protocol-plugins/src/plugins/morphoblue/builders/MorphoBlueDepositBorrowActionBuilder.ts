import {
  steps,
  getValueFromReference,
  TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'
import { MorphoBlueBorrowAction } from '../actions/MorphoBlueBorrowAction'
import { MorphoBlueDepositAction } from '../actions/MorphoBlueDepositAction'
import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { SendTokenAction, SetApprovalAction } from '../../common'
import { isMorphoBlueLendingPool } from '../interfaces/IMorphoBlueLendingPool'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class MorphoBlueDepositBorrowActionBuilder extends BaseActionBuilder<steps.DepositBorrowStep> {
  readonly actions: ActionBuilderUsedAction[] = [
    { action: SetApprovalAction },
    { action: MorphoBlueDepositAction },
    { action: MorphoBlueBorrowAction, isOptionalTags: ['borrowAmount'] },
    { action: SendTokenAction, isOptionalTags: ['borrowAmount', 'borrowTargetType'] },
  ]

  async build(params: ActionBuilderParams<steps.DepositBorrowStep>): Promise<void> {
    const { context, user, step, addressBookManager } = params

    if (!isMorphoBlueLendingPool(step.inputs.position.pool)) {
      throw new Error('Invalid Morpho lending pool id')
    }

    const morphoBlueAddress = await this._getContractAddress({
      addressBookManager,
      chainInfo: user.chainInfo,
      contractName: 'MorphoBlue',
    })

    context.addActionCall({
      step: step,
      action: new SetApprovalAction(),
      arguments: {
        approvalAmount: getValueFromReference(step.inputs.depositAmount),
        delegate: morphoBlueAddress,
        sumAmounts: false,
      },
      connectedInputs: {
        depositAmount: 'approvalAmount',
      },
      connectedOutputs: {},
    })

    context.addActionCall({
      step: params.step,
      action: new MorphoBlueDepositAction(),
      arguments: {
        morphoLendingPool: step.inputs.position.pool,
        amount: getValueFromReference(step.inputs.depositAmount),
        sumAmounts: false,
      },
      connectedInputs: {
        depositAmount: 'amount',
      },
      connectedOutputs: {
        depositAmount: 'depositedAmount',
      },
    })

    const borrowAmount = getValueFromReference(step.inputs.borrowAmount)

    context.addActionCall({
      step: step,
      action: new MorphoBlueBorrowAction(),
      arguments: {
        morphoLendingPool: step.inputs.position.pool,
        amount: borrowAmount,
      },
      connectedInputs: {},
      connectedOutputs: {
        borrowAmount: 'borrowedAmount',
      },
      skip: borrowAmount.toBN().isZero(),
    })

    const isBorrowTargetOperationExecutor =
      step.inputs.borrowTargetType !== TokenTransferTargetType.PositionsManager

    const operationExecutorAddress = await this._getContractAddress({
      addressBookManager,
      chainInfo: user.chainInfo,
      contractName: 'OperationExecutor',
    })

    context.addActionCall({
      step: step,
      action: new SendTokenAction(),
      arguments: {
        sendAmount: borrowAmount,
        sendTo: operationExecutorAddress,
      },
      connectedInputs: {
        borrowAmount: 'amount',
      },
      connectedOutputs: {},
      skip: borrowAmount.toBN().isZero() && isBorrowTargetOperationExecutor,
    })
  }
}
