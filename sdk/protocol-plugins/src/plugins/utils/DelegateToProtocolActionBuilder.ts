import { ActionBuilderParams, FilterStep } from '@summerfi/protocol-plugins-common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'

export function delegateToProtocolActionBuilder<Step extends steps.Steps>(params: {
  protocolName: ProtocolName
  actionBuilderParams: ActionBuilderParams<FilterStep<SimulationSteps, Step>>
}) {
  const { protocolName } = params
  const { protocolsRegistry } = params.actionBuilderParams

  const plugin = protocolsRegistry.getPlugin({ protocolName })
  if (!plugin) {
    throw new Error(`No protocol plugin found for protocol ${protocolName}`)
  }

  const builder = plugin.getActionBuilder(params.actionBuilderParams.step)
  if (!builder) {
    throw new Error(`No action builder found for protocol ${protocolName}`)
  }

  builder(params.actionBuilderParams)
}
