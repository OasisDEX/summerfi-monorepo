import { ActionBuilder } from '@summerfi/order-planner-common/builders'
import { SwapAction } from '~orderplannerservice/actions'
import { Percentage } from '@summerfi/sdk-common/common'
import { SwapStep } from '@summerfi/sdk-common/orders'

export const SwapActionBuilder: ActionBuilder<SwapStep> = (params): void => {
  const { context, step } = params

  context.addActionCall({
    step: step,
    action: new SwapAction(),
    arguments: {
      fromAmount: step.inputs.fromTokenAmount,
      toMinimumAmount: step.inputs.toTokenAmount,
      fee: Percentage.createFrom({ percentage: step.inputs.fee }),
      withData: '0x',
      collectFeeInFromToken: true,
    },
    connectedInputs: {},
    connectedOutputs: {
      receivedAmount: 'received',
    },
  })
}
