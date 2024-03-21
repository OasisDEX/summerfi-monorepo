import { FlashloanProvider, steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder, ActionBuilderParams } from '@summerfi/order-planner-common/builders'
import { ActionNames } from '@summerfi/deployment-types'
import { FlashloanAction } from '../actions/FlashloanAction'
import { SendTokenAction } from '../actions/SendTokenAction'
import { Address, AddressValue } from '@summerfi/sdk-common/common'

export const PaybackFlashloanActionList: ActionNames[] = []

/* This values are coming from TakeFlashloan contract data types */
export const FlashloanProviderMap: Record<FlashloanProvider, number> = {
  [FlashloanProvider.Maker]: 0,
  [FlashloanProvider.Balancer]: 1,
}

export const RepayFlashloanActionBuilder: ActionBuilder<steps.RepayFlashloan> = async (
  params: ActionBuilderParams<steps.RepayFlashloan>,
): Promise<void> => {
  const { context, step, deployment } = params

  context.addActionCall({
    step: step,
    action: new SendTokenAction(),
    arguments: {
      sendAmount: step.inputs.amount,
      sendTo: Address.createFrom({
        value: deployment.contracts.OperationExecutor.address as AddressValue,
      }),
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
