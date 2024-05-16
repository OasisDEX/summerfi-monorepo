import { ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { steps } from '@summerfi/sdk-common/simulation'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class OpenPositionActionBuilder extends BaseActionBuilder<steps.OpenPosition> {
  async build(params: ActionBuilderParams<steps.OpenPosition>): Promise<void> {
    const pool = params.step.inputs.pool

    await this._delegateToProtocol({
      protocolName: pool.id.protocol.name,
      actionBuilderParams: params,
    })
  }
}
