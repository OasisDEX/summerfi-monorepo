import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder, FilterStep } from '@summerfi/order-planner-common/builders'
import { Maybe } from '@summerfi/sdk-common/utils'

export interface IProtocolPlugin {
  getActionBuilder<StepType extends steps.Steps>(
    step: StepType,
  ): Maybe<ActionBuilder<FilterStep<SimulationSteps, StepType>>>
}
