import { ActionBuilder, ActionBuildersMap } from '@summerfi/order-planner-common/builders'
import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { MakerPaybackWithdrawActionBuilder } from './builders'
import { Maybe } from '@summerfi/sdk-common/common'
import { IProtocolActionBuilder } from '@summerfi/order-planner-common/interfaces'

export class MakerProtocolPlugin implements IProtocolActionBuilder {
  readonly StepBuilders: Partial<ActionBuildersMap> = {
    [SimulationSteps.PaybackWithdraw]: MakerPaybackWithdrawActionBuilder,
  }

  getActionBuilder<T extends steps.Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this.StepBuilders[step.type] as ActionBuilder<T>
  }
}
