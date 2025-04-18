import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import {
  IAddress,
  TokenTransferTargetType,
  getValueFromReference,
  steps,
} from '@summerfi/sdk-common'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'
import { SetApprovalAction } from '../../common/actions/SetApprovalAction'
import { getContractAddress } from '../../utils/GetContractAddress'
import { SparkBorrowAction } from '../actions/SparkBorrowAction'
import { SparkDepositAction } from '../actions/SparkDepositAction'
import { isSparkLendingPool } from '../interfaces/ISparkLendingPool'

export class SparkDepositBorrowActionBuilder extends BaseActionBuilder<steps.DepositBorrowStep> {
  readonly actions: ActionBuilderUsedAction[] = [
    { action: SetApprovalAction },
    { action: SparkDepositAction },
    { action: SparkBorrowAction, isOptionalTags: ['borrowAmount'] },
  ]

  async build(params: ActionBuilderParams<steps.DepositBorrowStep>): Promise<void> {
    const { context, user, step, addressBookManager } = params

    if (!isSparkLendingPool(step.inputs.position.pool)) {
      throw new Error('Invalid Spark lending pool')
    }

    const [sparkLendingPoolAddress, borrowTo] = await Promise.all([
      this._getContractAddress({
        addressBookManager,
        chainInfo: user.chainInfo,
        contractName: 'SparkLendingPool',
      }),
      this._getBorrowTargetAddress(params),
    ])

    context.addActionCall({
      step: step,
      action: new SetApprovalAction(),
      arguments: {
        approvalAmount: getValueFromReference(step.inputs.depositAmount),
        delegate: sparkLendingPoolAddress,
        sumAmounts: false,
      },
      connectedInputs: {
        depositAmount: 'approvalAmount',
      },
      connectedOutputs: {},
    })

    context.addActionCall({
      step: params.step,
      action: new SparkDepositAction(),
      arguments: {
        depositAmount: getValueFromReference(step.inputs.depositAmount),
        sumAmounts: false,
        setAsCollateral: true,
      },
      connectedInputs: {
        depositAmount: 'amountToDeposit',
      },
      connectedOutputs: {
        depositAmount: 'depositedAmount',
      },
    })

    const borrowAmount = getValueFromReference(step.inputs.borrowAmount)

    context.addActionCall({
      step: step,
      action: new SparkBorrowAction(),
      arguments: {
        borrowAmount: borrowAmount,
        borrowTo,
      },
      connectedInputs: {},
      connectedOutputs: {
        borrowAmount: 'borrowedAmount',
      },
      skip: borrowAmount.isZero(),
    })
  }

  /**
   * Resolves the target address for the borrow action based on the borrow target type
   * @param params The parameters for the action builder
   * @returns The address of the target contract
   */
  private async _getBorrowTargetAddress(
    params: ActionBuilderParams<steps.DepositBorrowStep>,
  ): Promise<IAddress> {
    const { user, step, positionsManager, addressBookManager } = params

    switch (step.inputs.borrowTargetType) {
      case TokenTransferTargetType.PositionsManager:
        return positionsManager.address

      case TokenTransferTargetType.StrategyExecutor:
        return getContractAddress({
          addressBookManager,
          chainInfo: user.chainInfo,
          contractName: 'OperationExecutor',
        })
      default:
        throw new Error(`Invalid borrow target type: ${step.inputs.borrowTargetType}`)
    }
  }
}
