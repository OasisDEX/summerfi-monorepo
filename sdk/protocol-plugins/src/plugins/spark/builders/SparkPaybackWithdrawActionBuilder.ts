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
import { SparkPaybackAction } from '../actions/SparkPaybackAction'
import { SparkWithdrawAction } from '../actions/SparkWithdrawAction'
import { isSparkLendingPool } from '../interfaces/ISparkLendingPool'

export class SparkPaybackWithdrawActionBuilder extends BaseActionBuilder<steps.PaybackWithdrawStep> {
  readonly actions: ActionBuilderUsedAction[] = [
    { action: SetApprovalAction, isOptionalTags: ['paybackAmount'] },
    { action: SparkPaybackAction, isOptionalTags: ['paybackAmount'] },
    { action: SparkWithdrawAction, isOptionalTags: ['withdrawAmount'] },
  ]

  async build(params: ActionBuilderParams<steps.PaybackWithdrawStep>): Promise<void> {
    const { context, step, addressBookManager, user, positionsManager } = params

    if (!isSparkLendingPool(step.inputs.position.pool)) {
      throw new Error('Invalid Spark lending pool')
    }

    const [sparkLendingPoolAddress, withdrawTo] = await Promise.all([
      this._getContractAddress({
        addressBookManager,
        chainInfo: user.chainInfo,
        contractName: 'SparkLendingPool',
      }),
      this._getWithdrawTargetAddress(params),
    ])

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
      skip: paybackAmount.isZero(),
    })

    context.addActionCall({
      step: params.step,
      action: new SparkPaybackAction(),
      arguments: {
        paybackAmount: getValueFromReference(step.inputs.paybackAmount),
        paybackAll: getValueFromReference(step.inputs.paybackAmount).isGreaterThan(
          step.inputs.position.debtAmount,
        ),
        onBehalf: positionsManager.address,
      },
      connectedInputs: {},
      connectedOutputs: {
        paybackAmount: 'paybackedAmount',
      },
      skip: paybackAmount.isZero(),
    })

    const withdrawAmount = getValueFromReference(step.inputs.withdrawAmount)

    context.addActionCall({
      step: step,
      action: new SparkWithdrawAction(),
      arguments: {
        withdrawAmount: withdrawAmount,
        withdrawTo,
      },
      connectedInputs: {},
      connectedOutputs: {
        withdrawAmount: 'withdrawnAmount',
      },
      skip: withdrawAmount.isZero(),
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
