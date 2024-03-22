import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { Maybe } from '@summerfi/sdk-common/common'
import { ActionBuilder, FilterStep } from '../builders/Types'

export interface IProtocolActionBuilder {
  getActionBuilder<StepType extends steps.Steps>(
    step: StepType,
  ): Maybe<ActionBuilder<FilterStep<SimulationSteps, StepType>>>
}
