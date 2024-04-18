import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { steps } from '@summerfi/sdk-common/simulation'
import { delegateToProtocolActionBuilder } from '../../utils/DelegateToProtocolActionBuilder'

export const DepositBorrowActionBuilder: ActionBuilder<steps.DepositBorrowStep> = async (
  params,
): Promise<void> => {
  delegateToProtocolActionBuilder({
    protocolName: params.step.inputs.position.pool.protocol.name,
    actionBuilderParams: params,
  })
}
