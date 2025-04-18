import { FlashloanProvider, steps } from '@summerfi/sdk-common'
import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
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
  /**
   * Special case for this action builder: the Flashloan action is not declared in the list of used
   * actions as it was already declared in the FlashloanActionBuilder. This is due to the Flashloan
   * inversion problem in which the flashloan action is used when the RepayFlashloan step is built,
   * but for the strategy definition we need to have the action registered at the Flashloan builder moment
   */
  readonly actions: ActionBuilderUsedAction[] = [{ action: SendTokenAction }]

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
