import { ActionBuilder, ActionBuildersMap } from '@summerfi/order-planner-common/builders'
import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { IProtocolPlugin } from '~protocolplugins/interfaces'
import { SparkDepositBorrowActionBuilder } from './builders'
import { Maybe } from '@summerfi/sdk-common/utils'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { ProtocolPluginsRegistry } from '~protocolplugins/implementation'

export class SparkProtocolPlugin implements IProtocolPlugin {
  readonly protocol = ProtocolName.Spark

  readonly StepBuilders: Partial<ActionBuildersMap> = {
    [SimulationSteps.DepositBorrow]: SparkDepositBorrowActionBuilder,
  }

  getActionBuilder<T extends steps.Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this.StepBuilders[step.type] as ActionBuilder<T>
  }
}

ProtocolPluginsRegistry.registerProtocolPlugin(ProtocolName.Spark, SparkProtocolPlugin)
