import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { TokenTransferTargetType, getValueFromReference, steps } from '@summerfi/sdk-common'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'
import { SetApprovalAction } from '../../common/actions/SetApprovalAction'
import { SendTokenAction } from '../../common/actions/SendTokenAction'
import { MorphoBorrowAction } from '../actions/MorphoBorrowAction'
import { MorphoDepositAction } from '../actions/MorphoDepositAction'
import { isMorphoLendingPool } from '../interfaces/IMorphoLendingPool'

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

    const [morphoBlueAddress, operationExecutorAddress] = await Promise.all([
      this._getContractAddress({
        addressBookManager,
        chainInfo: user.chainInfo,
        contractName: 'MorphoBlue',
      }),
      this._getContractAddress({
        addressBookManager,
        chainInfo: user.chainInfo,
        contractName: 'OperationExecutor',
      }),
    ])

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
      skip: borrowAmount.isZero(),
    })

    const isBorrowTargetPositionsManager =
      step.inputs.borrowTargetType === TokenTransferTargetType.PositionsManager

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
      skip: borrowAmount.isZero() || isBorrowTargetPositionsManager,
    })
  }
}
