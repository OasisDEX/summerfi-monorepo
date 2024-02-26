import { PaybackWithdrawStep } from '@summerfi/sdk-common/orders'
import { ActionBuilder } from '@summerfi/order-planner-common/builders'
import { ProtocolPluginsRegistry } from '@summerfi/protocol-plugins'

export const PaybackWithdrawActionBuilder: ActionBuilder<PaybackWithdrawStep> = (params): void => {
  const protocol = params.step.inputs.position.pool.protocol

  const plugin = ProtocolPluginsRegistry.getProtocolPlugin(protocol)
  if (!plugin) {
    throw new Error(`No protocol plugin found for protocol ${protocol}`)
  }

  const builder = plugin.getActionBuilder(params.step)
  if (!builder) {
    throw new Error(`No action builder found for protocol ${protocol}`)
  }

  builder(params)
}
