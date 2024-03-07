import { steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/order-planner-common/builders'
import { ProtocolPluginsRegistry } from '@summerfi/protocol-plugins'

export const PaybackWithdrawActionBuilder: ActionBuilder<steps.PaybackWithdrawStep> = async (
  params,
): Promise<void> => {
  const protocol = params.step.inputs.position.pool.protocol

  const plugin = ProtocolPluginsRegistry.getProtocolPlugin(protocol.name)
  if (!plugin) {
    throw new Error(`No protocol plugin found for protocol ${protocol.name}`)
  }

  const builder = plugin.getActionBuilder(params.step)
  if (!builder) {
    throw new Error(`No action builder found for protocol ${protocol.name}`)
  }

  builder(params)
}
