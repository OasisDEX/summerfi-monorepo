import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { steps } from '@summerfi/sdk-common/simulation'

export const DepositBorrowActionBuilder: ActionBuilder<steps.DepositBorrowStep> = async (
  params,
): Promise<void> => {
  const { step, protocolsRegistry } = params

  const protocol = step.inputs.position.pool.protocol

  const plugin = protocolsRegistry.getPlugin({ protocolName: protocol.name })
  if (!plugin) {
    throw new Error(`No protocol plugin found for protocol ${protocol.name}`)
  }

  const builder = plugin.getActionBuilder(params.step)
  if (!builder) {
    throw new Error(`No action builder found for protocol ${protocol.name}`)
  }

  builder(params)
}
