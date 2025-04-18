import { steps } from '@summerfi/sdk-common'
import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { ReturnFundsAction } from '../actions/ReturnFundsAction'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class ReturnFundsActionBuilder extends BaseActionBuilder<steps.ReturnFundsStep> {
  readonly actions: ActionBuilderUsedAction[] = [{ action: ReturnFundsAction }]

  async build(params: ActionBuilderParams<steps.ReturnFundsStep>): Promise<void> {
    const { context, step } = params

    context.addActionCall({
      step: step,
      action: new ReturnFundsAction(),
      arguments: {
        asset: step.inputs.token,
      },
      connectedInputs: {},
      connectedOutputs: {},
    })
  }
}
