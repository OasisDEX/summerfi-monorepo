import { ActionNames } from '@summerfi/deployment-types'
import { FlashloanStep, Simulation, SimulationType } from '@summerfi/sdk-common/orders'
import { ActionBuilder } from '~orderplanner/builders'
import { OrderPlannerContext } from '~orderplanner/context'

export const FlashloanActionList: ActionNames[] = ['TakeFlashloan']

export const FlashloanActionBuilder: ActionBuilder<FlashloanStep> = (params: {
  context: OrderPlannerContext
  simulation: Simulation<SimulationType>
  step: FlashloanStep
}): void => {
  // Start a new calls level until the flashloan is finished
  params.context.startSubContext({
    customData: params.step.inputs,
  })
}
