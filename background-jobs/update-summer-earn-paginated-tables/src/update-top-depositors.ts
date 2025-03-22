import type { Context, EventBridgeEvent } from 'aws-lambda'
import { updater } from './helpers/updater'

export const topDepositorsHandler = async (
  _: EventBridgeEvent<'Scheduled Event', never>,
  context: Context,
): Promise<void> => {
  await updater(context, 'top-depositors')
}

export default topDepositorsHandler
