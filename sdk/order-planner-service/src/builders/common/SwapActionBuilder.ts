import { Simulation, SimulationType, SwapStep } from '@summerfi/sdk-common/orders'
import { ActionBuilder } from '~orderplanner/builders'
import { OrderPlannerContext } from '~orderplanner/context'
import { SwapAction } from '~orderplanner/actions'
import { Percentage } from '@summerfi/sdk-common/common'

export const SwapActionBuilder: ActionBuilder<SwapStep> = (params: {
  context: OrderPlannerContext
  simulation: Simulation<SimulationType>
  step: SwapStep
}): void => {
  params.context.addActionCall({
    step: params.step,
    action: new SwapAction(),
    arguments: {
      fromAmount: params.step.inputs.fromTokenAmount,
      toMinimumAmount: params.step.inputs.toTokenAmount,
      fee: Percentage.createFrom({ percentage: params.step.inputs.fee }),
      withData: '0x',
      collectFeeInFromToken: true,
    },
    connectedInputs: {},
    connectedOutputs: {
      receivedAmount: 'received',
    },
  })
}
