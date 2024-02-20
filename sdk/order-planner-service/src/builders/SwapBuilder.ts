import { Simulation, SimulationType, SwapStep } from '@summerfi/sdk-common/orders'
import { StepBuilder, OrderPlannerContext } from '~orderplanner/interfaces'
import { SwapAction } from '~orderplanner/actions'
import { Percentage } from '@summerfi/sdk-common/common'

export const SwapBuilder: StepBuilder<SwapStep> = (params: {
  context: OrderPlannerContext
  simulation: Simulation<SimulationType>
  step: SwapStep
}): void => {
  params.context.addActionCall({
    step: params.step,
    actionClass: SwapAction,
    arguments: {
      fromAmount: params.step.inputs.fromTokenAmount,
      toMinimumAmount: params.step.inputs.toTokenAmount,
      fee: Percentage.createFrom({ percentage: params.step.inputs.fee }),
      withData: '0x',
      collectFeeInFromToken: true,
    },
  })
}
