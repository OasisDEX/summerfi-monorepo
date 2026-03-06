import type { Context, EventBridgeEvent } from 'aws-lambda'
import { updater } from './helpers/updater'

export const vaultsBenchmarkHandler = async (
  _: EventBridgeEvent<'Scheduled Event', never>,
  context: Context,
): Promise<void> => {
  await updater(context, 'vaults-benchmark')
}

export default vaultsBenchmarkHandler
