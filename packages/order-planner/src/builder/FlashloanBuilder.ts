import { FlashloanStep, Simulation, SimulationType } from '@summerfi/sdk/orders'
import { ActionCall } from '~orderplanner/interfaces'
import { StepBuilder } from '~orderplanner/interfaces/Types'
import { ActionNames } from '@summerfi/deployment-types'
import { PullToken } from '~orderplanner/actions'

export const FlashloanActionList: ActionNames[] = ['TakeFlashloan']

/* eslint-disable @typescript-eslint/no-unused-vars */
export const FlashloanBuilder: StepBuilder<FlashloanStep> = (params: {
  simulation: Simulation<SimulationType>
  step: FlashloanStep
}): ActionCall[] => {
  const pullToken = new PullToken()

  const pullTokenCall = pullToken.encode({
    pullAmount: params.step.amount,
    pullTo: params.simulation.positionsManager,
  })

  return [pullTokenCall]
}
