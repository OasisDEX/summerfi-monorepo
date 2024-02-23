import { ReturnFunds, Simulation, SimulationType } from '@summerfi/sdk-common/orders'
import { ActionBuilder } from '~orderplanner/builders'
import { OrderPlannerContext } from '~orderplanner/context'
import { ReturnFundsAction } from '~orderplanner/actions'

export const ReturnFundsActionBuilder: ActionBuilder<ReturnFunds> = (params: {
  context: OrderPlannerContext
  simulation: Simulation<SimulationType>
  step: ReturnFunds
}): void => {
  params.context.addActionCall({
    step: params.step,
    action: new ReturnFundsAction(),
    arguments: {
      asset: params.step.inputs.token,
    },
    connectedInputs: {},
    connectedOutputs: {},
  })
}
