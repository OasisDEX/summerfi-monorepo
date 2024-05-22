import {
  steps,
  getValueFromReference,
  TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'
import { ActionNames } from '@summerfi/deployment-types'
import { IAddress } from '@summerfi/sdk-common/common'
import { ActionBuilder, ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { SetApprovalAction } from '../../common'
import { AaveV3DepositAction } from '../actions/AaveV3DepositAction'
import { AaveV3BorrowAction } from '../actions/AaveV3BorrowAction'
import { getContractAddress } from '../../utils/GetContractAddress'
import { isAaveV3LendingPool } from '../interfaces/IAaveV3LendingPool'

export const AaveV3DepositBorrowActionList: ActionNames[] = ['AaveV3Deposit', 'AaveV3Borrow']

async function getBorrowTargetAddress(
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

export const AaveV3DepositBorrowActionBuilder: ActionBuilder<steps.DepositBorrowStep> = async (
  params,
): Promise<void> => {
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
        borrowTo: await getBorrowTargetAddress(params),
      },
      connectedInputs: {},
      connectedOutputs: {
        borrowAmount: 'borrowedAmount',
      },
    })
  }
}
