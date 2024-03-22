import { steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/order-planner-common/builders'

export const DepositBorrowActionBuilder: ActionBuilder<steps.DepositBorrowStep> = async (
  params,
): Promise<void> => {
  const { step, protocolsRegistry } = params

  const protocol = step.inputs.position.pool.protocol

  const plugin = protocolsRegistry[protocol.name]
  if (!plugin) {
    throw new Error(`No protocol plugin found for protocol ${protocol.name}`)
  }

  const builder = new plugin().getActionBuilder(params.step)
  if (!builder) {
    throw new Error(`No action builder found for protocol ${protocol.name}`)
  }

  builder(params)
}
