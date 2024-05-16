import {
  steps,
  getValueFromReference,
  TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'
import { IAddress } from '@summerfi/sdk-common/common'
import { ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { SetApprovalAction } from '../../common'
import { AaveV3WithdrawAction } from '../actions/AaveV3WithdrawAction'
import { AaveV3PaybackAction } from '../actions/AaveV3PaybackAction'
import { getContractAddress } from '../../utils/GetContractAddress'
import { isAaveV3LendingPool } from '../interfaces/IAaveV3LendingPool'
import { Address } from '@summerfi/sdk-common'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class AaveV3PaybackWithdrawActionBuilder extends BaseActionBuilder<steps.PaybackWithdrawStep> {
  async build(params: ActionBuilderParams<steps.PaybackWithdrawStep>): Promise<void> {
    const { context, step, addressBookManager, user } = params

    if (!isAaveV3LendingPool(step.inputs.position.pool)) {
      throw new Error('Invalid AaveV3 lending pool')
    }

    const sparkLendingPoolAddress = await getContractAddress({
      addressBookManager,
      chainInfo: user.chainInfo,
      contractName: 'AavePool',
    })

    const paybackAmount = getValueFromReference(step.inputs.paybackAmount)

    if (!paybackAmount.toBN().isZero()) {
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
      })

      context.addActionCall({
        step: params.step,
        action: new AaveV3PaybackAction(),
        arguments: {
          paybackAmount: getValueFromReference(step.inputs.paybackAmount),
          paybackAll: getValueFromReference(step.inputs.paybackAmount)
            .toBN()
            .gt(step.inputs.position.debtAmount.toBN()),
          onBehalf: Address.ZeroAddressEthereum,
        },
        connectedInputs: {},
        connectedOutputs: {
          paybackAmount: 'paybackedAmount',
        },
      })
    }

    const withdrawAmount = getValueFromReference(step.inputs.withdrawAmount)

    if (!withdrawAmount.toBN().isZero()) {
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
      })
    }
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
    if (step.inputs.withdrawTargetType === TokenTransferTargetType.PositionsManager) {
      return positionsManager.address
    }

    return getContractAddress({
      addressBookManager,
      chainInfo: user.chainInfo,
      contractName: 'OperationExecutor',
    })
  }
}
