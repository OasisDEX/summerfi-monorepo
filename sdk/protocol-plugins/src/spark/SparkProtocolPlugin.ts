import { ActionBuilder, ActionBuildersMap } from '@summerfi/order-planner-common/builders'
import { SimulationSteps, Steps } from '@summerfi/sdk-common/orders'
import { IProtocolPlugin } from '~protocolplugins/interfaces'
import { SparkDepositBorrowActionBuilder } from './builders'
import { Maybe } from '@summerfi/sdk-common/utils'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { ProtocolPluginRegistry } from '~protocolplugins/implementation'

export class SparkProtocolPlugin implements IProtocolPlugin {
  readonly protocol = ProtocolName.Spark

  readonly StepBuilders: Partial<ActionBuildersMap> = {
    [SimulationSteps.DepositBorrow]: SparkDepositBorrowActionBuilder,
  }

  getActionBuilder<T extends Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this.StepBuilders[step.type] as ActionBuilder<T>
  }
}

ProtocolPluginRegistry.registerProtocolPlugin(ProtocolName.Spark, SparkProtocolPlugin)
