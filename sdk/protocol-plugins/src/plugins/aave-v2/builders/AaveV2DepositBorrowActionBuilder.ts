import { getValueFromReference, steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/order-planner-common/builders'
import { ActionNames } from '@summerfi/deployment-types'
import { AaveV2DepositAction } from '../actions/AaveV2DepositAction.ts'
import { AaveV2BorrowAction } from '../actions/AaveV2BorrowAction.ts'
import { Address, AddressValue } from '@summerfi/sdk-common/common'

export const AaveV2DepositBorrowActionList: ActionNames[] = ['AaveV2Deposit', 'AaveV2Borrow']

export const AaveV2DepositBorrowActionBuilder: ActionBuilder<steps.DepositBorrowStep> = async (
    params,
    ): Promise<void> => {
        const { context, user, step } = params

        context.addActionCall({
        step: params.step,
        action: new AaveV2DepositAction(),
        arguments: {
        /** INSERT HERE - ARGS EG
        * depositAmount: getValueFromReference(step.inputs.depositAmount),
        * sumAmounts: false,
        * setAsCollateral: true,
        **/
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
        /** INSERT HERE - ARGS EG
        * borrowAmount: getValueFromReference(step.inputs.borrowAmount),
        * borrowTo: positionsManager.address,
        **/
        },
        connectedInputs: {},
        connectedOutputs: {
            borrowAmount: 'borrowedAmount',
        },
        })
}