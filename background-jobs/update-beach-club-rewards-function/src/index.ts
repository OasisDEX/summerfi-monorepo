import { Logger } from '@aws-lambda-powertools/logger'
import { Context, EventBridgeEvent } from 'aws-lambda'
import { DatabaseService } from './db'
import { ReferralProcessor } from './processor'

const logger = new Logger({ serviceName: 'update-beach-club-rewards-function', logLevel: 'DEBUG' })

export const handler = async (
  _: EventBridgeEvent<'Scheduled Event', never>,
  context: Context,
): Promise<void> => {
  logger.addContext(context)
  logger.debug('Handler started')

  const processor = new ReferralProcessor({ logger })
  try {
    const result = await processor.processLatest()
    if (result.success) {
      logger.info('Processing completed successfully')
      return
    }

    logger.error('Processing failed', { error: result.error })
    throw result.error ?? new Error('Processing failed without an error')
  } finally {
    await processor.close()
  }
}
