import { steps, getValueFromReference } from '@summerfi/sdk-common/simulation'
import { ActionNames } from '@summerfi/deployment-types'
import { PullTokenAction } from '../actions/PullTokenAction'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'

export const PullTokenActionList: ActionNames[] = ['PullToken']

export const PullTokenActionBuilder: ActionBuilder<steps.PullTokenStep> = async (
  params,
): Promise<void> => {
  const { context, positionsManager, step } = params

  context.addActionCall({
    step: params.step,
    action: new PullTokenAction(),
    arguments: {
      pullAmount: getValueFromReference(step.inputs.amount),
      pullTo: positionsManager.address,
    },
    connectedInputs: {},
    connectedOutputs: {},
  })
}
