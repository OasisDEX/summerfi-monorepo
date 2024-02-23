import { ReturnFunds } from '@summerfi/sdk-common/orders'
import { ActionBuilder } from '~orderplanner/builders'
import { ReturnFundsAction } from '~orderplanner/actions'

export const ReturnFundsActionBuilder: ActionBuilder<ReturnFunds> = (params): void => {
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
