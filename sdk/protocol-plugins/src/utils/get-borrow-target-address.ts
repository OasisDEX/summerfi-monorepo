import {
    steps,
    TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'
import { Address, AddressValue } from '@summerfi/sdk-common/common'
import { ActionBuilderParams } from '@summerfi/protocol-plugins-common'

/**
 * @method getBorrowTargetAddress
 * @description Resolves whether borrow target is position manager (eg DPM) or OpExec.
 */
export function getBorrowTargetAddress(params: ActionBuilderParams<steps.DepositBorrowStep>): Address {
    const { step, positionsManager, deployment } = params

    return step.inputs.borrowTargetType === TokenTransferTargetType.PositionsManager
        ? positionsManager.address
        : Address.createFromEthereum({
            value: deployment.contracts.OperationExecutor.address as AddressValue,
        })
}