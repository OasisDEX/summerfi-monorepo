import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { steps } from '@summerfi/sdk-common/simulation'
import { delegateToProtocolActionBuilder } from '../../utils/DelegateToProtocolActionBuilder'

export const ImportPositionActionBuilder: ActionBuilder<steps.ImportStep> = async (
  params,
): Promise<void> => {
  const externalPosition = params.step.inputs.externalPosition

  delegateToProtocolActionBuilder({
    protocolName: externalPosition.position.pool.id.protocol.name,
    actionBuilderParams: params,
  })
}
