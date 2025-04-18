import { steps, getValueFromReference } from '@summerfi/sdk-common'
import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { PullTokenAction } from '../actions/PullTokenAction'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class PullTokenActionBuilder extends BaseActionBuilder<steps.PullTokenStep> {
  readonly actions: ActionBuilderUsedAction[] = [{ action: PullTokenAction }]

  async build(params: ActionBuilderParams<steps.PullTokenStep>): Promise<void> {
    const { context, positionsManager, step } = params

    context.addActionCall({
      step: params.step,
      action: new PullTokenAction(),
      arguments: {
        pullAmount: getValueFromReference(step.inputs.amount),
        pullFrom: positionsManager.address,
      },
      connectedInputs: {},
      connectedOutputs: {},
    })
  }
}
