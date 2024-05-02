import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { steps } from '@summerfi/sdk-common/simulation'
import { delegateToProtocolActionBuilder } from '../../utils/DelegateToProtocolActionBuilder'

export const PaybackWithdrawActionBuilder: ActionBuilder<steps.PaybackWithdrawStep> = async (
  params,
): Promise<void> => {
  delegateToProtocolActionBuilder({
    protocolName: params.step.inputs.position.pool.id.protocol.name,
    actionBuilderParams: params,
  })
}
