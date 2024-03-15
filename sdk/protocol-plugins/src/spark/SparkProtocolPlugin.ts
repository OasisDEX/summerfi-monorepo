import { ActionBuilder, ActionBuildersMap } from '@summerfi/order-planner-common/builders'
import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { SparkDepositBorrowActionBuilder } from './builders'
import { Maybe } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { IProtocolActionBuilder } from '@summerfi/order-planner-common/interfaces'

export class SparkProtocolPlugin implements IProtocolActionBuilder {
  readonly protocol = ProtocolName.Spark

  readonly StepBuilders: Partial<ActionBuildersMap> = {
    [SimulationSteps.DepositBorrow]: SparkDepositBorrowActionBuilder,
  }

  getActionBuilder<T extends steps.Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this.StepBuilders[step.type] as ActionBuilder<T>
  }
}
