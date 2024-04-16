import { steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { ReturnFundsAction } from '../actions/ReturnFundsAction'

export const ReturnFundsActionBuilder: ActionBuilder<steps.ReturnFundsStep> = async (
  params,
): Promise<void> => {
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
