import { ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { steps } from '@summerfi/sdk-common/simulation'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class ImportPositionActionBuilder extends BaseActionBuilder<steps.ImportStep> {
  async build(params: ActionBuilderParams<steps.ImportStep>): Promise<void> {
    const externalPosition = params.step.inputs.externalPosition

    return this._delegateToProtocol({
      protocolName: externalPosition.position.pool.id.protocol.name,
      actionBuilderParams: params,
    })
  }
}
