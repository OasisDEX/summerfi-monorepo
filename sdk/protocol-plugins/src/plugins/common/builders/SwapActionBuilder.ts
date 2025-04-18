import { steps } from '@summerfi/sdk-common'
import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { SwapAction } from '../actions/SwapAction'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class SwapActionBuilder extends BaseActionBuilder<steps.SwapStep> {
  readonly actions: ActionBuilderUsedAction[] = [{ action: SwapAction }]

  async build(params: ActionBuilderParams<steps.SwapStep>): Promise<void> {
    const { context, user, swapManager, addressBookManager, step } = params

    const swapContractAddress = await this._getContractAddress({
      addressBookManager,
      chainInfo: user.chainInfo,
      contractName: 'Swap',
    })

    const swapData = await swapManager.getSwapDataExactInput({
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
}
