import type { Context, EventBridgeEvent } from 'aws-lambda'
import { updater } from './helpers/updater'

export const latestActivityHandler = async (
  _: EventBridgeEvent<'Scheduled Event', never>,
  context: Context,
): Promise<void> => {
  await updater(context, 'latest-activiy')
}

export default latestActivityHandler
