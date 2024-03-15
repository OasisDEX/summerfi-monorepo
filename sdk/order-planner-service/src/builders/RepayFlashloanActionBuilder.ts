import { FlashloanProvider, steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder, ActionBuilderParams } from '@summerfi/order-planner-common/builders'
import { FlashloanAction } from '~orderplannerservice/actions'
import { ActionNames } from '@summerfi/deployment-types'

export const PaybackFlashloanActionList: ActionNames[] = []

/* This values are coming from TakeFlashloan contract data types */
export const FlashloanProviderMap: Record<FlashloanProvider, number> = {
  [FlashloanProvider.Maker]: 0,
  [FlashloanProvider.Balancer]: 1,
}

export const RepayFlashloanActionBuilder: ActionBuilder<steps.RepayFlashloan> = async (
  params: ActionBuilderParams<steps.RepayFlashloan>,
): Promise<void> => {
  // End the current subcontext and pass the subcontext calls to the flashloan action
  const { callsBatch, customData } = params.context.endSubContext<steps.FlashloanStep['inputs']>()
  if (!customData) {
    throw new Error('RepayFlashloanBuilder: customData is undefined')
  }

  params.context.addActionCall({
    step: params.step,
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
