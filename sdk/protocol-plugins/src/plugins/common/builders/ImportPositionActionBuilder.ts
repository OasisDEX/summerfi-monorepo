import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { steps } from '@summerfi/sdk-common'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class ImportPositionActionBuilder extends BaseActionBuilder<steps.ImportStep> {
  readonly actions: ActionBuilderUsedAction[] = [{ action: 'DelegatedToProtocol' }]

  async build(params: ActionBuilderParams<steps.ImportStep>): Promise<void> {
    const externalPosition = params.step.inputs.externalPosition

    return this._delegateToProtocol({
      protocolName: externalPosition.pool.id.protocol.name,
      actionBuilderParams: params,
    })
  }
}
