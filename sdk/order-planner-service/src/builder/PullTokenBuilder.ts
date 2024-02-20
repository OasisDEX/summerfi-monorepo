import { PullTokenStep, Simulation, SimulationType } from '@summerfi/sdk-common/orders'
import { ActionCall, StepBuilder, OrderPlannerContext } from '~orderplanner/interfaces'
import { ActionNames } from '@summerfi/deployment-types'
import { PullToken } from '~orderplanner/actions'

export const PullTokenActionList: ActionNames[] = ['PullToken']

/* eslint-disable @typescript-eslint/no-unused-vars */
export const PullTokenBuilder: StepBuilder<PullTokenStep> = (params: {
  context: OrderPlannerContext
  simulation: Simulation<SimulationType>
  step: PullTokenStep
}): ActionCall[] => {
  const pullToken = new PullToken()

  const pullTokenCall = pullToken.encode({
    pullAmount: params.step.inputs.amount,
    pullTo: params.simulation.positionsManagerAddress,
  })

  return [pullTokenCall]
}
