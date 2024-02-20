import { FlashloanStep, Simulation, SimulationType } from '@summerfi/sdk-common/orders'
import { OrderPlannerContext } from '~orderplanner/interfaces'
import { StepBuilder } from '~orderplanner/interfaces/Types'

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
