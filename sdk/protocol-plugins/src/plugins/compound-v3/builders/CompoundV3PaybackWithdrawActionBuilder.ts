import { getValueFromReference, steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { ActionNames } from '@summerfi/deployment-types'
import { CompoundV3PaybackAction } from '../actions/CompoundV3PaybackAction'
import { CompoundV3WithdrawAction } from '../actions/CompoundV3WithdrawAction'
import { Address, AddressValue } from '@summerfi/sdk-common/common'

export const CompoundV3PaybackWithdrawActionList: ActionNames[] = ['CompoundV3Payback', 'CompoundV3Withdraw']

export const CompoundV3PaybackWithdrawActionBuilder: ActionBuilder<steps.PaybackWithdrawStep> = async (
    params,
    ): Promise<void> => {
        const { context, user, step } = params

        context.addActionCall({
        step: params.step,
        action: new CompoundV3PaybackAction(),
        arguments: {
        /** INSERT HERE - ARGS EG
        * pool: step.inputs.position.pool,
        * userAddress: user.wallet.address,
        * amount: getValueFromReference(step.inputs.withdrawAmount),
        * paybackAll: true, // TODO: we cannot always calculate this value because debtAmount and paybackAmount are references
        **/
        },
        connectedInputs: {},
        connectedOutputs: {
        paybackAmount: 'amountPaidBack',
        },
        })

        context.addActionCall({
        step: step,
        action: new CompoundV3WithdrawAction(),
        arguments: {
        /** INSERT HERE - ARGS EG
        * pool: step.inputs.position.pool,
        * userAddress: user.wallet.address,
        * amount: getValueFromReference(step.inputs.withdrawAmount),
        **/
        },
        connectedInputs: {},
        connectedOutputs: {
        withdrawAmount: 'amountWithdrawn',
        },
        })
        }