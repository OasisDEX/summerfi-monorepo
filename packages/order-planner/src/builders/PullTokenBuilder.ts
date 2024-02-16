import { SimulationSteps, Step } from '@summerfi/sdk/orders'
import { ActionCall } from '~orderplanner/interfaces'
import { StepBuilder } from '~orderplanner/interfaces/Types'

/* eslint-disable @typescript-eslint/no-unused-vars */
export const PullTokenBuilder: StepBuilder<SimulationSteps.PullToken> = (params: {
  step: Step<SimulationSteps.PullToken>
}): ActionCall[] => {
  return []
}
