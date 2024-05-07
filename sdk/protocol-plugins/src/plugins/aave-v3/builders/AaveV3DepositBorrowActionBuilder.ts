import {
  steps,
  getValueFromReference,
  TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'
import { ActionNames } from '@summerfi/deployment-types'
import { Address, AddressValue } from '@summerfi/sdk-common/common'
import { ActionBuilder, ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { SetApprovalAction } from '../../common'
import { AaveV3DepositAction } from '../actions/AaveV3DepositAction'
import { AaveV3BorrowAction } from '../actions/AaveV3BorrowAction'

export const AaveV3DepositBorrowActionList: ActionNames[] = ['AaveV3Deposit', 'AaveV3Borrow']

function getBorrowTargetAddress(params: ActionBuilderParams<steps.DepositBorrowStep>): Address {
  const { step, positionsManager, deployment } = params

  return step.inputs.borrowTargetType === TokenTransferTargetType.PositionsManager
    ? positionsManager.address
    : Address.createFromEthereum({
        value: deployment.contracts.OperationExecutor.address as AddressValue,
      })
}

export const AaveV3DepositBorrowActionBuilder: ActionBuilder<steps.DepositBorrowStep> = async (
  params,
): Promise<void> => {
  const { context, step, deployment } = params

  const aaveV3LendingPool = Address.createFromEthereum({
    value: deployment.dependencies.AaveV3LendingPool.address as AddressValue,
  })

  context.addActionCall({
    step: step,
    action: new SetApprovalAction(),
    arguments: {
      approvalAmount: getValueFromReference(step.inputs.depositAmount),
      delegate: aaveV3LendingPool,
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
        borrowTo: getBorrowTargetAddress(params),
      },
      connectedInputs: {},
      connectedOutputs: {
        borrowAmount: 'borrowedAmount',
      },
    })
  }
}
