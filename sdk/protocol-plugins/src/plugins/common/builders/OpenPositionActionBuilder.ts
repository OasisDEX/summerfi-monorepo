import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { steps } from '@summerfi/sdk-common'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class OpenPositionActionBuilder extends BaseActionBuilder<steps.OpenPosition> {
  readonly actions: ActionBuilderUsedAction[] = [{ action: 'DelegatedToProtocol' }]

  async build(params: ActionBuilderParams<steps.OpenPosition>): Promise<void> {
    const pool = params.step.inputs.pool

    await this._delegateToProtocol({
      protocolName: pool.id.protocol.name,
      actionBuilderParams: params,
    })
  }
}
