import { getValueFromReference, steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { ActionNames } from '@summerfi/deployment-types'
import { getBorrowTargetAddress } from '../../../utils/get-borrow-target-address'
import { SetApprovalAction } from '../../common'
import { AaveV2DepositAction } from '../actions/AaveV2DepositAction'
import { AaveV2BorrowAction } from '../actions/AaveV2BorrowAction'
import { Address, AddressValue } from '@summerfi/sdk-common/common'

export const AaveV2DepositBorrowActionList: ActionNames[] = ['AaveDeposit', 'AaveBorrow']

export const AaveV2DepositBorrowActionBuilder: ActionBuilder<steps.DepositBorrowStep> = async (
  params,
): Promise<void> => {
  const { context, step, deployment } = params

  const aaveV2LendingPool = Address.createFromEthereum({
    value: deployment.dependencies.AaveLendingPool.address as AddressValue,
  })

  context.addActionCall({
    step: step,
    action: new SetApprovalAction(),
    arguments: {
      approvalAmount: getValueFromReference(step.inputs.depositAmount),
      delegate: aaveV2LendingPool,
      sumAmounts: false,
    },
    connectedInputs: {
      depositAmount: 'approvalAmount',
    },
    connectedOutputs: {},
  })

  context.addActionCall({
    step: params.step,
    action: new AaveV2DepositAction(),
    arguments: {
      depositAmount: getValueFromReference(step.inputs.depositAmount),
      sumAmounts: false,
      setAsCollateral: true,
    },
    connectedInputs: {},
    connectedOutputs: {
      depositAmount: 'depositedAmount',
    },
  })

  context.addActionCall({
    step: step,
    action: new AaveV2BorrowAction(),
    arguments: {
      borrowAmount: getValueFromReference(step.inputs.borrowAmount),
      borrowTo: getBorrowTargetAddress(params),
    },
    connectedInputs: {},
    connectedOutputs: {
      borrowAmount: 'borrowedAmount',
    },
  })
}
