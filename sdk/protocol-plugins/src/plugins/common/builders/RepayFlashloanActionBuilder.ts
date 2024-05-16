import { FlashloanProvider, steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { SendTokenAction } from '../actions/SendTokenAction'
import { FlashloanAction } from '../actions/FlashloanAction'
import { getContractAddress } from '../../utils/GetContractAddress'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

/* This values are coming from TakeFlashloan contract data types */
export const FlashloanProviderMap: Record<FlashloanProvider, number> = {
  [FlashloanProvider.Maker]: 0,
  [FlashloanProvider.Balancer]: 1,
}

export class RepayFlashloanActionBuilder extends BaseActionBuilder<steps.RepayFlashloanStep> {
  async build(params: ActionBuilderParams<steps.RepayFlashloanStep>): Promise<void> {
    const { user, context, step, addressBookManager } = params

    const operationExecutorAddress = await getContractAddress({
      addressBookManager,
      chainInfo: user.chainInfo,
      contractName: 'OperationExecutor',
    })

    context.addActionCall({
      step: step,
      action: new SendTokenAction(),
      arguments: {
        sendAmount: step.inputs.amount,
        sendTo: operationExecutorAddress,
      },
      connectedInputs: {},
      connectedOutputs: {},
    })

    // End the current subcontext and pass the subcontext calls to the flashloan action
    const { callsBatch, customData } = context.endSubContext<steps.FlashloanStep['inputs']>()
    if (!customData) {
      throw new Error('RepayFlashloanBuilder: customData is undefined')
    }

    context.addActionCall({
      step: step,
      action: new FlashloanAction(),
      arguments: {
        amount: customData.amount,
        provider: FlashloanProviderMap[customData.provider],
        calls: callsBatch,
      },
      connectedInputs: {},
      connectedOutputs: {},
    })
  }
}
