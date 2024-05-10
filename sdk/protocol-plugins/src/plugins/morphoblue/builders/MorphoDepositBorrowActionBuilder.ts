import {
  steps,
  getValueFromReference,
  TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'

import { MorphoBorrowAction } from '../actions/MorphoBorrowAction'
import { MorphoDepositAction } from '../actions/MorphoDepositAction'
import { Address, AddressValue } from '@summerfi/sdk-common/common'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { SendTokenAction, SetApprovalAction } from '../../common'
import { isMorphoLendingPool } from '../interfaces/IMorphoLendingPool'

export const MorphoDepositBorrowActionBuilder: ActionBuilder<steps.DepositBorrowStep> = async (
  params,
): Promise<void> => {
  const { context, step, deployment } = params

  if (!isMorphoLendingPool(step.inputs.position.pool)) {
    throw new Error('Invalid Morpho lending pool id')
  }

  const morphoBlue = Address.createFromEthereum({
    value: deployment.dependencies.MorphoBlue.address as AddressValue,
  })

  context.addActionCall({
    step: step,
    action: new SetApprovalAction(),
    arguments: {
      approvalAmount: getValueFromReference(step.inputs.depositAmount),
      delegate: morphoBlue,
      sumAmounts: false,
    },
    connectedInputs: {
      depositAmount: 'approvalAmount',
    },
    connectedOutputs: {},
  })

  context.addActionCall({
    step: params.step,
    action: new MorphoDepositAction(),
    arguments: {
      morphoLendingPool: step.inputs.position.pool,
      amount: getValueFromReference(step.inputs.depositAmount),
      sumAmounts: false,
    },
    connectedInputs: {
      depositAmount: 'amount',
    },
    connectedOutputs: {
      depositAmount: 'depositedAmount',
    },
  })

  const borrowAmount = getValueFromReference(step.inputs.borrowAmount)

  if (!borrowAmount.toBN().isZero()) {
    context.addActionCall({
      step: step,
      action: new MorphoBorrowAction(),
      arguments: {
        morphoLendingPool: step.inputs.position.pool,
        amount: borrowAmount,
      },
      connectedInputs: {},
      connectedOutputs: {
        borrowAmount: 'borrowedAmount',
      },
    })

    if (step.inputs.borrowTargetType !== TokenTransferTargetType.PositionsManager) {
      const operationExecutorAddress = Address.createFromEthereum({
        value: deployment.contracts.OperationExecutor.address as AddressValue,
      })

      context.addActionCall({
        step: step,
        action: new SendTokenAction(),
        arguments: {
          sendAmount: borrowAmount,
          sendTo: operationExecutorAddress,
        },
        connectedInputs: {
          borrowAmount: 'amount',
        },
        connectedOutputs: {},
      })
    }
  }
}
