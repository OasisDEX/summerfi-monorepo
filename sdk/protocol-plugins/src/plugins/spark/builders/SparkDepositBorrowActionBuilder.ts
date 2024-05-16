import {
  steps,
  getValueFromReference,
  TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'
import { SparkBorrowAction } from '../actions/SparkBorrowAction'
import { SparkDepositAction } from '../actions/SparkDepositAction'
import { IAddress } from '@summerfi/sdk-common/common'
import { ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { SetApprovalAction } from '../../common'
import { getContractAddress } from '../../utils/GetContractAddress'
import { isSparkLendingPool } from '../interfaces/ISparkLendingPool'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class SparkDepositBorrowActionBuilder extends BaseActionBuilder<steps.DepositBorrowStep> {
  async build(params: ActionBuilderParams<steps.DepositBorrowStep>): Promise<void> {
    const { context, user, step, addressBookManager } = params

    if (!isSparkLendingPool(step.inputs.position.pool)) {
      throw new Error('Invalid Spark lending pool')
    }

    const sparkLendingPoolAddress = await this._getContractAddress({
      addressBookManager,
      chainInfo: user.chainInfo,
      contractName: 'SparkLendingPool',
    })

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

    if (!borrowAmount.toBN().isZero()) {
      context.addActionCall({
        step: step,
        action: new SparkBorrowAction(),
        arguments: {
          borrowAmount: borrowAmount,
          borrowTo: await this._getBorrowTargetAddress(params),
        },
        connectedInputs: {},
        connectedOutputs: {
          borrowAmount: 'borrowedAmount',
        },
      })
    }
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
    if (step.inputs.borrowTargetType === TokenTransferTargetType.PositionsManager) {
      return positionsManager.address
    }

    return getContractAddress({
      addressBookManager,
      chainInfo: user.chainInfo,
      contractName: 'OperationExecutor',
    })
  }
}
