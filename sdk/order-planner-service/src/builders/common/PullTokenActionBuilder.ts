import { PullTokenStep, Simulation, SimulationType } from '@summerfi/sdk-common/orders'
import { ActionBuilder } from '~orderplanner/builders'
import { OrderPlannerContext } from '~orderplanner/context'
import { ActionNames } from '@summerfi/deployment-types'
import { PullTokenAction } from '~orderplanner/actions'

export const PullTokenActionList: ActionNames[] = ['PullToken']

export const PullTokenActionBuilder: ActionBuilder<PullTokenStep> = (params: {
  context: OrderPlannerContext
  simulation: Simulation<SimulationType>
  step: PullTokenStep
}): void => {
  params.context.addActionCall({
    step: params.step,
    action: new PullTokenAction(),
    arguments: {
      pullAmount: params.step.inputs.amount,
      pullTo: params.simulation.positionsManagerAddress,
    },
    connectedInputs: {},
    connectedOutputs: {},
  })
}
