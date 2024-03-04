import { steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/order-planner-common/builders'
import { ReturnFundsAction } from '~orderplannerservice/actions'

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
