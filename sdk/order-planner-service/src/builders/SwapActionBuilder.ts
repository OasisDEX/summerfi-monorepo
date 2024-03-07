import { ActionBuilder } from '@summerfi/order-planner-common/builders'
import { SwapAction } from '~orderplannerservice/actions'
import { Address, Percentage } from '@summerfi/sdk-common/common'
import { steps } from '@summerfi/sdk-common/simulation'
import { HexData } from '@summerfi/sdk-common/common/aliases'

export const SwapActionBuilder: ActionBuilder<steps.SwapStep> = async (params): Promise<void> => {
  const { context, swapManager, deployment, step } = params

  const swapContractInfo = deployment.contracts['Swap']

  const swapData = await swapManager.getSwapDataExactInput({
    chainInfo: params.user.chain.chainInfo,
    fromAmount: step.inputs.fromTokenAmount,
    toToken: step.inputs.toTokenAmount.token,
    recipient: Address.createFrom({ value: swapContractInfo.address as HexData }),
    // TODO: change slippage in Simulator to a Percentage type
    slippage: Percentage.createFrom({ percentage: step.inputs.slippage }),
  })

  context.addActionCall({
    step: step,
    action: new SwapAction(),
    arguments: {
      fromAmount: step.inputs.fromTokenAmount,
      toMinimumAmount: step.inputs.toTokenAmount,
      fee: Percentage.createFrom({ percentage: step.inputs.fee }),
      withData: swapData.calldata,
      collectFeeInFromToken: true,
    },
    connectedInputs: {},
    connectedOutputs: {
      receivedAmount: 'received',
    },
  })
}
