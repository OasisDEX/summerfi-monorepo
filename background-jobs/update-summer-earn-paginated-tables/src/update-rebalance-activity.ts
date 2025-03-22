import type { Context, EventBridgeEvent } from 'aws-lambda'
import { updater } from './helpers/updater'

export const rebalanceActivityHandler = async (
  _: EventBridgeEvent<'Scheduled Event', never>,
  context: Context,
): Promise<void> => {
  await updater(context, 'rebalance-activity')
}

export default rebalanceActivityHandler
