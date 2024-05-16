import { steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { PositionCreatedAction } from '../actions/PositionCreatedAction'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'
export class PositionCreatedActionBuilder extends BaseActionBuilder<steps.NewPositionEventStep> {
  async build(params: ActionBuilderParams<steps.NewPositionEventStep>): Promise<void> {
    const { context, step } = params

    context.addActionCall({
      step: step,
      action: new PositionCreatedAction(),
      arguments: {
        position: step.inputs.position,
      },
      connectedInputs: {},
      connectedOutputs: {},
    })
  }
}
