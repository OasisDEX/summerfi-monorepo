import { ActionBuilder, ActionBuildersMap } from '@summerfi/order-planner-common/builders'
import { SimulationSteps, Steps } from '@summerfi/sdk-common/orders'
import { IProtocolPlugin } from '~protocolplugins/interfaces'
import { MakerPaybackWithdrawActionBuilder } from './builders'
import { Maybe } from '@summerfi/sdk-common/utils'
import { ProtocolPluginsRegistry } from '~protocolplugins/implementation'
import { ProtocolName } from '@summerfi/sdk-common/protocols'

export class MakerProtocolPlugin implements IProtocolPlugin {
  readonly StepBuilders: Partial<ActionBuildersMap> = {
    [SimulationSteps.PaybackWithdraw]: MakerPaybackWithdrawActionBuilder,
  }

  getActionBuilder<T extends Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this.StepBuilders[step.type] as ActionBuilder<T>
  }
}

ProtocolPluginsRegistry.registerProtocolPlugin(ProtocolName.Maker, MakerProtocolPlugin)
