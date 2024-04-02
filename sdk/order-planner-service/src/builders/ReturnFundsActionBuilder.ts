import { steps } from '@summerfi/sdk-common/simulation'
import { ReturnFundsAction } from '../actions/ReturnFundsAction'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'

export const ReturnFundsActionBuilder: ActionBuilder<steps.ReturnFunds> = async (
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
