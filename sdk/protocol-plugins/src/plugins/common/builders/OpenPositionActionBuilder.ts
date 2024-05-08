import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { steps } from '@summerfi/sdk-common/simulation'
import { delegateToProtocolActionBuilder } from '../../utils/DelegateToProtocolActionBuilder'

export const OpenPositionActionBuilder: ActionBuilder<steps.OpenPosition> = async (
  params,
): Promise<void> => {
  const pool = params.step.inputs.pool

  delegateToProtocolActionBuilder({
    protocolName: pool.id.protocol.name,
    actionBuilderParams: params,
  })
}
