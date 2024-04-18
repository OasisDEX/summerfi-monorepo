import { getValueFromReference, steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { ActionNames } from '@summerfi/deployment-types'
import { CompoundV3DepositAction } from '../actions/compound-v3DepositAction'
import { CompoundV3BorrowAction } from '../actions/compound-v3BorrowAction'
import { Address, AddressValue } from '@summerfi/sdk-common/common'

export const CompoundV3DepositBorrowActionList: ActionNames[] = ['CompoundV3Deposit', 'CompoundV3Borrow']

export const CompoundV3DepositBorrowActionBuilder: ActionBuilder<steps.DepositBorrowStep> = async (
    params,
    ): Promise<void> => {
        const { context, user, step } = params

        context.addActionCall({
        step: params.step,
        action: new CompoundV3DepositAction(),
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
        action: new CompoundV3BorrowAction(),
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