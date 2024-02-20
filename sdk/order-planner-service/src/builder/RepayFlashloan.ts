import {
  FlashloanProvider,
  FlashloanStep,
  RepayFlashloan,
  Simulation,
  SimulationType,
} from '@summerfi/sdk-common/orders'
import { OrderPlannerContext } from '~orderplanner/interfaces'
import { StepBuilder } from '~orderplanner/interfaces/Types'
import { ActionNames } from '@summerfi/deployment-types'
import { FlashloanAction } from '~orderplanner/actions'

export const FlashloanActionList: ActionNames[] = ['TakeFlashloan']

/* This values are coming from TakeFlashloan contract data types */
export const FlashloanProviderMap: Record<FlashloanProvider, number> = {
  [FlashloanProvider.Maker]: 0,
  [FlashloanProvider.Balancer]: 1,
}

export const RepayFlashloanBuilder: StepBuilder<RepayFlashloan> = (params: {
  context: OrderPlannerContext
  simulation: Simulation<SimulationType>
  step: RepayFlashloan
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
