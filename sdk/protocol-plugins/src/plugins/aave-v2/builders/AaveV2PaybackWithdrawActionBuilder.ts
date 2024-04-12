import { getValueFromReference, steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/order-planner-common/builders'
import { ActionNames } from '@summerfi/deployment-types'
import { AaveV2PaybackAction } from '../actions/AaveV2PaybackAction.ts'
import { AaveV2WithdrawAction } from '../actions/AaveV2WithdrawAction.ts'
import { Address, AddressValue } from '@summerfi/sdk-common/common'

export const AaveV2PaybackWithdrawActionList: ActionNames[] = ['AaveV2Payback', 'AaveV2Withdraw']

export const AaveV2PaybackWithdrawActionBuilder: ActionBuilder<steps.PaybackWithdrawStep> = async (
    params,
    ): Promise<void> => {
        const { context, user, step } = params

        context.addActionCall({
        step: params.step,
        action: new AaveV2PaybackAction(),
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
        action: new AaveV2WithdrawAction(),
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