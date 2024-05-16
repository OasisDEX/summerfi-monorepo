import { ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { steps } from '@summerfi/sdk-common/simulation'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class PaybackWithdrawActionBuilder extends BaseActionBuilder<steps.PaybackWithdrawStep> {
  async build(params: ActionBuilderParams<steps.PaybackWithdrawStep>): Promise<void> {
    return this._delegateToProtocol({
      protocolName: params.step.inputs.position.pool.id.protocol.name,
      actionBuilderParams: params,
    })
  }
}
