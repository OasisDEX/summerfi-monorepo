import {
  steps,
  getValueFromReference,
  TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'
import { MorphoBorrowAction } from '../actions/MorphoBorrowAction'
import { MorphoDepositAction } from '../actions/MorphoDepositAction'
import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { SendTokenAction, SetApprovalAction } from '../../common'
import { isMorphoLendingPool } from '../interfaces/IMorphoLendingPool'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class MorphoDepositBorrowActionBuilder extends BaseActionBuilder<steps.DepositBorrowStep> {
  readonly actions: ActionBuilderUsedAction[] = [
    { action: SetApprovalAction },
    { action: MorphoDepositAction },
    { action: MorphoBorrowAction, isOptionalTags: ['borrowAmount'] },
    { action: SendTokenAction, isOptionalTags: ['borrowAmount', 'borrowTargetType'] },
  ]

  async build(params: ActionBuilderParams<steps.DepositBorrowStep>): Promise<void> {
    const { context, user, step, addressBookManager } = params

    if (!isMorphoLendingPool(step.inputs.position.pool)) {
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
      action: new MorphoDepositAction(),
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
      action: new MorphoBorrowAction(),
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

    const isBorrowTargetPositionsManager =
      step.inputs.borrowTargetType === TokenTransferTargetType.PositionsManager

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
      skip: borrowAmount.toBN().isZero() || isBorrowTargetPositionsManager,
    })
  }
}
