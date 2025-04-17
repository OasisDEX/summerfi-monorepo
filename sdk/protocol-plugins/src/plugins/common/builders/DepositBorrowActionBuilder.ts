import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { steps } from '@summerfi/sdk-common'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class DepositBorrowActionBuilder extends BaseActionBuilder<steps.DepositBorrowStep> {
  readonly actions: ActionBuilderUsedAction[] = [{ action: 'DelegatedToProtocol' }]

  async build(params: ActionBuilderParams<steps.DepositBorrowStep>): Promise<void> {
    return this._delegateToProtocol({
      protocolName: params.step.inputs.position.pool.id.protocol.name,
      actionBuilderParams: params,
    })
  }
}
