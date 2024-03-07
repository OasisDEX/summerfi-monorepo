import { ActionBuilder, ActionBuildersMap } from '@summerfi/order-planner-common/builders'
import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { IProtocolPlugin } from '~protocolplugins/interfaces/IProtocolPlugin'
import { MakerPaybackWithdrawActionBuilder } from './builders'
import { Maybe } from '@summerfi/sdk-common/common'
import { ProtocolPluginsRegistry } from '~protocolplugins/implementation/ProtocolPluginsRegistry'
import { ProtocolName } from '@summerfi/sdk-common/protocols'

export class MakerProtocolPlugin implements IProtocolPlugin {
  readonly StepBuilders: Partial<ActionBuildersMap> = {
    [SimulationSteps.PaybackWithdraw]: MakerPaybackWithdrawActionBuilder,
  }

  getActionBuilder<T extends steps.Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this.StepBuilders[step.type] as ActionBuilder<T>
  }
}

ProtocolPluginsRegistry.registerProtocolPlugin(ProtocolName.Maker, MakerProtocolPlugin)
