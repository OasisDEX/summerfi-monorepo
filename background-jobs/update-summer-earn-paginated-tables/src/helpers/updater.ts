import type { Context } from 'aws-lambda'
import { Logger } from '@aws-lambda-powertools/logger'
import process from 'node:process'
import { updateTable } from './update-table'

const logger = new Logger({ serviceName: 'update-summer-earn-paginated-tables', logLevel: 'DEBUG' })

export const updater = async (context: Context, tableName: string): Promise<void> => {
  logger.addContext(context)
  logger.debug('Handler started')

  const { EARN_PROTOCOL_UPDATE_TABLES_AUTH_TOKEN, EARN_APP_URL, NODE_ENV } = process.env

  const authToken = EARN_PROTOCOL_UPDATE_TABLES_AUTH_TOKEN

  if (!NODE_ENV) {
    logger.error('NODE_ENV is not set')
    return
  }

  if (!EARN_APP_URL) {
    logger.error('EARN_APP_URL is not set')
    return
  }

  if (!authToken) {
    logger.error('EARN_PROTOCOL_UPDATE_TABLES_AUTH_TOKEN is not set')
    return
  }

  try {
    await updateTable(authToken, EARN_APP_URL, tableName)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    logger.error(`Error updating ${tableName} table`, { error: errorMessage })
  }

  logger.debug('Handler completed')
}
