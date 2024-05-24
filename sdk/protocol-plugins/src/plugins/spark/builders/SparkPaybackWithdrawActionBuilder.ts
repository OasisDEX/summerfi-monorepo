import {
  steps,
  getValueFromReference,
  TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'
import { IAddress } from '@summerfi/sdk-common/common'
import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { SetApprovalAction } from '../../common'
import { SparkWithdrawAction } from '../actions/SparkWithdrawAction'
import { SparkPaybackAction } from '../actions/SparkPaybackAction'
import { getContractAddress } from '../../utils/GetContractAddress'
import { isSparkLendingPool } from '../interfaces/ISparkLendingPool'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class SparkPaybackWithdrawActionBuilder extends BaseActionBuilder<steps.PaybackWithdrawStep> {
  readonly actions: ActionBuilderUsedAction[] = [
    { action: SetApprovalAction, isOptionalTags: ['paybackAmount'] },
    { action: SparkPaybackAction, isOptionalTags: ['paybackAmount'] },
    { action: SparkWithdrawAction, isOptionalTags: ['withdrawAmount'] },
  ]

  async build(params: ActionBuilderParams<steps.PaybackWithdrawStep>): Promise<void> {
    const { context, step, addressBookManager, user } = params

    if (!isSparkLendingPool(step.inputs.position.pool)) {
      throw new Error('Invalid Spark lending pool')
    }

    const sparkLendingPoolAddress = await this._getContractAddress({
      addressBookManager,
      chainInfo: user.chainInfo,
      contractName: 'SparkLendingPool',
    })

    const paybackAmount = getValueFromReference(step.inputs.paybackAmount)

    context.addActionCall({
      step: step,
      action: new SetApprovalAction(),
      arguments: {
        approvalAmount: getValueFromReference(step.inputs.paybackAmount),
        delegate: sparkLendingPoolAddress,
        sumAmounts: false,
      },
      connectedInputs: {
        paybackAmount: 'approvalAmount',
      },
      connectedOutputs: {},
      skip: paybackAmount.toBN().isZero(),
    })

    context.addActionCall({
      step: params.step,
      action: new SparkPaybackAction(),
      arguments: {
        paybackAmount: getValueFromReference(step.inputs.paybackAmount),
        paybackAll: getValueFromReference(step.inputs.paybackAmount)
          .toBN()
          .gt(step.inputs.position.debtAmount.toBN()),
      },
      connectedInputs: {},
      connectedOutputs: {
        paybackAmount: 'paybackedAmount',
      },
      skip: paybackAmount.toBN().isZero(),
    })

    const withdrawAmount = getValueFromReference(step.inputs.withdrawAmount)

    context.addActionCall({
      step: step,
      action: new SparkWithdrawAction(),
      arguments: {
        withdrawAmount: withdrawAmount,
        withdrawTo: await this._getWithdrawTargetAddress(params),
      },
      connectedInputs: {},
      connectedOutputs: {
        withdrawAmount: 'withdrawnAmount',
      },
      skip: withdrawAmount.toBN().isZero(),
    })
  }

  /**
   * Resolves the target address for the withdraw action based on the withdraw target type
   * @param params The parameters for the action builder
   * @returns The address of the target contract
   */
  private async _getWithdrawTargetAddress(
    params: ActionBuilderParams<steps.PaybackWithdrawStep>,
  ): Promise<IAddress> {
    const { user, step, positionsManager, addressBookManager } = params

    switch (step.inputs.withdrawTargetType) {
      case TokenTransferTargetType.PositionsManager:
        return positionsManager.address

      case TokenTransferTargetType.StrategyExecutor:
        return getContractAddress({
          addressBookManager,
          chainInfo: user.chainInfo,
          contractName: 'OperationExecutor',
        })
      default:
        throw new Error(`Invalid withdraw target type: ${step.inputs.withdrawTargetType}`)
    }
  }
}
