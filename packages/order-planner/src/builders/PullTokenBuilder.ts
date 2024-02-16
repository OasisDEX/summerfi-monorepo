import { PullTokenStep, Simulation, SimulationType } from '@summerfi/sdk/orders'
import { ActionCall } from '~orderplanner/interfaces'
import { StepBuilder } from '~orderplanner/interfaces/Types'
import { ActionNames } from '@summerfi/deployment-types'
import { PullToken } from '~orderplanner/actions'

export const PullTokenActionList: ActionNames[] = ['PullToken']

/* eslint-disable @typescript-eslint/no-unused-vars */
export const PullTokenBuilder: StepBuilder<PullTokenStep> = (params: {
  simulation: Simulation<SimulationType, unknown>
  step: PullTokenStep
}): ActionCall[] => {
  const pullToken = new PullToken()

  const pullTokenCall = pullToken.encode({
    pullAmount: params.step.amount,
    pullTo: params.simulation.positionsManager,
  })

  return [pullTokenCall]
}
