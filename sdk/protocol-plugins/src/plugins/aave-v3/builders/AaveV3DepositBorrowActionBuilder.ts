import {
  steps,
  getValueFromReference,
  TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'
import { IAddress } from '@summerfi/sdk-common/common'
import { ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { SetApprovalAction } from '../../common'
import { AaveV3DepositAction } from '../actions/AaveV3DepositAction'
import { AaveV3BorrowAction } from '../actions/AaveV3BorrowAction'
import { getContractAddress } from '../../utils/GetContractAddress'
import { isAaveV3LendingPool } from '../interfaces/IAaveV3LendingPool'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class AaveV3DepositBorrowActionBuilder extends BaseActionBuilder<steps.DepositBorrowStep> {
  async build(params: ActionBuilderParams<steps.DepositBorrowStep>): Promise<void> {
    const { context, step, addressBookManager, user } = params

    if (!isAaveV3LendingPool(step.inputs.position.pool)) {
      throw new Error('Invalid AaveV3 lending pool')
    }

    const aaveV3LendingPoolAddress = await getContractAddress({
      addressBookManager,
      chainInfo: user.chainInfo,
      contractName: 'AaveV3LendingPool',
    })

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

    if (!borrowAmount.toBN().isZero()) {
      context.addActionCall({
        step: step,
        action: new AaveV3BorrowAction(),
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
