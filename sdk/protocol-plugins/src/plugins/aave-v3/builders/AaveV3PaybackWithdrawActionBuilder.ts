import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { Address } from '@summerfi/sdk-common'
import { IAddress } from '@summerfi/sdk-common/common'
import {
  TokenTransferTargetType,
  getValueFromReference,
  steps,
} from '@summerfi/sdk-common/simulation'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'
import { SetApprovalAction } from '../../common'
import { getContractAddress } from '../../utils/GetContractAddress'
import { AaveV3PaybackAction } from '../actions/AaveV3PaybackAction'
import { AaveV3WithdrawAction } from '../actions/AaveV3WithdrawAction'
import { isAaveV3LendingPool } from '../interfaces/IAaveV3LendingPool'

export class AaveV3PaybackWithdrawActionBuilder extends BaseActionBuilder<steps.PaybackWithdrawStep> {
  readonly actions: ActionBuilderUsedAction[] = [
    { action: SetApprovalAction, isOptionalTags: ['paybackAmount'] },
    { action: AaveV3PaybackAction, isOptionalTags: ['paybackAmount'] },
    { action: AaveV3WithdrawAction, isOptionalTags: ['withdrawAmount'] },
  ]

  async build(params: ActionBuilderParams<steps.PaybackWithdrawStep>): Promise<void> {
    const { context, step, addressBookManager, user } = params

    if (!isAaveV3LendingPool(step.inputs.position.vault)) {
      throw new Error('Invalid AaveV3 lending pool')
    }

    const sparkLendingPoolAddress = await getContractAddress({
      addressBookManager,
      chainInfo: user.chainInfo,
      contractName: 'AavePool',
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
      skip: paybackAmount.isZero(),
    })

    context.addActionCall({
      step: params.step,
      action: new AaveV3PaybackAction(),
      arguments: {
        paybackAmount: getValueFromReference(step.inputs.paybackAmount),
        paybackAll: getValueFromReference(step.inputs.paybackAmount).isGreaterThan(
          step.inputs.position.debtAmount,
        ),
        onBehalf: Address.ZeroAddressEthereum,
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
      action: new AaveV3WithdrawAction(),
      arguments: {
        withdrawAmount: withdrawAmount,
        withdrawTo: await this._getWithdrawTargetAddress(params),
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
