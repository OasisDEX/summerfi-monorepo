import { steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { PositionCreatedAction } from '../actions/PositionCreatedAction'

export const PositionCreatedActionBuilder: ActionBuilder<steps.NewPositionEvent> = async (
  params,
): Promise<void> => {
  const { context, step } = params

  context.addActionCall({
    step: step,
    action: new PositionCreatedAction(),
    arguments: {
      position: step.inputs.position,
      positionType: step.inputs.positionType,
    },
    connectedInputs: {},
    connectedOutputs: {},
  })
}
