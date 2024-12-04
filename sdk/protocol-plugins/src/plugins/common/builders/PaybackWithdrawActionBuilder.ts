import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { steps } from '@summerfi/sdk-common/simulation'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class PaybackWithdrawActionBuilder extends BaseActionBuilder<steps.PaybackWithdrawStep> {
  readonly actions: ActionBuilderUsedAction[] = [{ action: 'DelegatedToProtocol' }]

  async build(params: ActionBuilderParams<steps.PaybackWithdrawStep>): Promise<void> {
    return this._delegateToProtocol({
      protocolName: params.step.inputs.position.vault.id.protocol.name,
      actionBuilderParams: params,
    })
  }
}
