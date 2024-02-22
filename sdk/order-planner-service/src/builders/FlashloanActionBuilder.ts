import { FlashloanStep, Simulation, SimulationType } from '@summerfi/sdk-common/orders'
import { OrderPlannerContext, ActionBuilder } from '~orderplanner/interfaces'

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
