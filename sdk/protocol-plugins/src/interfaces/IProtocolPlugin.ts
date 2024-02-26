import { SimulationSteps, Steps } from '@summerfi/sdk-common/orders'
import { ActionBuilder, FilterStep } from '@summerfi/order-planner-common/builders'
import { Maybe } from '@summerfi/sdk-common/utils'

export interface IProtocolPlugin {
  getActionBuilder<StepType extends Steps>(
    step: StepType,
  ): Maybe<ActionBuilder<FilterStep<SimulationSteps, StepType>>>
}
