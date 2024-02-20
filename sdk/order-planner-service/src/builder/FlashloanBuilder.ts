import {
  FlashloanProvider,
  FlashloanStep,
  Simulation,
  SimulationType,
} from '@summerfi/sdk-common/orders'
import { ActionCall, OrderPlannerContext } from '~orderplanner/interfaces'
import { StepBuilder } from '~orderplanner/interfaces/Types'
import { ActionNames } from '@summerfi/deployment-types'
import { Flashloan } from '~orderplanner/actions'

export const FlashloanActionList: ActionNames[] = ['TakeFlashloan']

/* This values are coming from TakeFlashloan contract data types */
export const FlashloanProviderMap: Record<FlashloanProvider, number> = {
  [FlashloanProvider.Maker]: 0,
  [FlashloanProvider.Balancer]: 1,
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export const FlashloanBuilder: StepBuilder<FlashloanStep> = (params: {
  context: OrderPlannerContext
  simulation: Simulation<SimulationType>
  step: FlashloanStep
}): ActionCall[] => {
  const flashloan = new Flashloan()
  const flashloanProvider = FlashloanProviderMap[params.step.inputs.provider]

  const flashloanCall = flashloan.encode({
    amount: params.step.inputs.amount,
    provider: flashloanProvider,
    calls: [],
  })

  return [flashloanCall]
}
