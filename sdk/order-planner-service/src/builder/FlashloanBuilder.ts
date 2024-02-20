import { FlashloanStep, Simulation, SimulationType } from '@summerfi/sdk-common/orders'
import { OrderPlannerContext } from '~orderplanner/interfaces'
import { StepBuilder } from '~orderplanner/interfaces/Types'
import { ActionNames } from '@summerfi/deployment-types'

export const FlashloanActionList: ActionNames[] = ['TakeFlashloan']

export const FlashloanBuilder: StepBuilder<FlashloanStep> = (params: {
  context: OrderPlannerContext
  simulation: Simulation<SimulationType>
  step: FlashloanStep
}): void => {
  // Start a new calls level until the flashloan is finished
  params.context.startSubContext({
    customData: params.step.inputs,
  })
}
