import { PullTokenStep, Simulation, SimulationType } from '@summerfi/sdk-common/orders'
import { StepBuilder, OrderPlannerContext } from '~orderplanner/interfaces'
import { ActionNames } from '@summerfi/deployment-types'
import { PullTokenAction } from '~orderplanner/actions'

export const PullTokenActionList: ActionNames[] = ['PullToken']

export const PullTokenBuilder: StepBuilder<PullTokenStep> = (params: {
  context: OrderPlannerContext
  simulation: Simulation<SimulationType>
  step: PullTokenStep
}): void => {
  params.context.addActionCall({
    step: params.step,
    actionClass: PullTokenAction,
    arguments: {
      pullAmount: params.step.inputs.amount,
      pullTo: params.simulation.positionsManagerAddress,
    },
  })
}
