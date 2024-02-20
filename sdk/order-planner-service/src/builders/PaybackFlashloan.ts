import {
  FlashloanProvider,
  FlashloanStep,
  PaybackFlashloan,
  Simulation,
  SimulationType,
} from '@summerfi/sdk-common/orders'
import { OrderPlannerContext } from '~orderplanner/interfaces'
import { StepBuilder } from '~orderplanner/interfaces/Types'
import { FlashloanAction } from '~orderplanner/actions'

/* This values are coming from TakeFlashloan contract data types */
export const FlashloanProviderMap: Record<FlashloanProvider, number> = {
  [FlashloanProvider.Maker]: 0,
  [FlashloanProvider.Balancer]: 1,
}

export const PaybackFlashloanBuilder: StepBuilder<PaybackFlashloan> = (params: {
  context: OrderPlannerContext
  simulation: Simulation<SimulationType>
  step: PaybackFlashloan
}): void => {
  // End the current subcontext and pass the subcontext calls to the flashloan action
  const { callsBatch, customData } = params.context.endSubContext<FlashloanStep['inputs']>()
  if (!customData) {
    throw new Error('RepayFlashloanBuilder: customData is undefined')
  }

  params.context.addActionCall({
    step: params.step,
    actionClass: FlashloanAction,
    arguments: {
      amount: customData.amount,
      provider: FlashloanProviderMap[customData.provider],
      calls: callsBatch,
    },
  })
}
