import { PullTokenStep } from '@summerfi/sdk-common/orders'
import { ActionBuilder } from '@summerfi/order-planner-common/builders'
import { ActionNames } from '@summerfi/deployment-types'
import { PullTokenAction } from '~orderplannerservice/actions'

export const PullTokenActionList: ActionNames[] = ['PullToken']

export const PullTokenActionBuilder: ActionBuilder<PullTokenStep> = (params): void => {
  const { context, positionsManager, step } = params

  context.addActionCall({
    step: params.step,
    action: new PullTokenAction(),
    arguments: {
      pullAmount: step.inputs.amount,
      pullTo: positionsManager.address.toString(),
    },
    connectedInputs: {},
    connectedOutputs: {},
  })
}
