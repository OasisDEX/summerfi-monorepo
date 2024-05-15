import { steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { SwapAction } from '../actions/SwapAction'
import { getContractAddress } from '../../utils/GetContractAddress'

export const SwapActionBuilder: ActionBuilder<steps.SwapStep> = async (params): Promise<void> => {
  const { context, user, swapManager, addressBookManager, step } = params

  const swapContractAddress = await getContractAddress({
    addressBookManager,
    chainInfo: user.chainInfo,
    contractName: 'Swap',
  })

  const swapData = await swapManager.getSwapDataExactInput({
    chainInfo: params.user.chainInfo,
    fromAmount: step.inputs.inputAmountAfterFee,
    toToken: step.inputs.minimumReceivedAmount.token,
    recipient: swapContractAddress,
    slippage: step.inputs.slippage,
  })

  context.addActionCall({
    step: step,
    action: new SwapAction(),
    arguments: {
      fromAmount: step.inputs.inputAmount,
      toMinimumAmount: step.inputs.minimumReceivedAmount,
      fee: step.inputs.summerFee,
      withData: swapData.calldata,
      collectFeeInFromToken: true,
    },
    connectedInputs: {},
    connectedOutputs: {
      received: 'received',
    },
  })
}
