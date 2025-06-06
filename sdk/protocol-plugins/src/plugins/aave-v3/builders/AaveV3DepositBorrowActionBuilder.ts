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
import { AaveV3BorrowAction } from '../actions/AaveV3BorrowAction'
import { AaveV3DepositAction } from '../actions/AaveV3DepositAction'
import { isAaveV3LendingPool } from '../interfaces/IAaveV3LendingPool'

export class AaveV3DepositBorrowActionBuilder extends BaseActionBuilder<steps.DepositBorrowStep> {
  readonly actions: ActionBuilderUsedAction[] = [
    { action: SetApprovalAction },
    { action: AaveV3DepositAction },
    { action: AaveV3BorrowAction, isOptionalTags: ['borrowAmount'] },
  ]

  async build(params: ActionBuilderParams<steps.DepositBorrowStep>): Promise<void> {
    const { context, step, addressBookManager, user } = params

    if (!isAaveV3LendingPool(step.inputs.position.pool)) {
      throw new Error('Invalid AaveV3 lending pool')
    }

    const [aaveV3LendingPoolAddress, borrowTo] = await Promise.all([
      getContractAddress({
        addressBookManager,
        chainInfo: user.chainInfo,
        contractName: 'AavePool',
      }),
      this._getBorrowTargetAddress(params),
    ])

    context.addActionCall({
      step: step,
      action: new SetApprovalAction(),
      arguments: {
        approvalAmount: getValueFromReference(step.inputs.depositAmount),
        delegate: aaveV3LendingPoolAddress,
        sumAmounts: false,
      },
      connectedInputs: {
        depositAmount: 'approvalAmount',
      },
      connectedOutputs: {},
    })

    context.addActionCall({
      step: params.step,
      action: new AaveV3DepositAction(),
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
      action: new AaveV3BorrowAction(),
      arguments: {
        borrowAmount,
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
