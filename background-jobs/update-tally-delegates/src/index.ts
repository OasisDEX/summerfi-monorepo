import type { Context } from 'aws-lambda'
import { Logger } from '@aws-lambda-powertools/logger'
import process from 'node:process'
import { getSumrDelegates } from './get-sumr-delegates'
import { getSumrDecayFactor } from './get-sumr-decay-factor'
import { updateDelegates } from './update-delegates'

const logger = new Logger({ serviceName: 'update-tally-delegates', logLevel: 'DEBUG' })

export const handler = async (context: Context): Promise<void> => {
  logger.addContext(context)
  logger.debug('update-tally-delegates handler started')

  const { EARN_PROTOCOL_DB_CONNECTION_STRING } = process.env

  if (!EARN_PROTOCOL_DB_CONNECTION_STRING) {
    logger.error('EARN_PROTOCOL_DB_CONNECTION_STRING is not set')
    return
  }

  try {
    logger.debug('Getting SUMR delegates')
    const sumrDelegates = await getSumrDelegates()
    logger.debug(`Fetched ${sumrDelegates.length} SUMR delegates`)

    const addresses = sumrDelegates.map((delegate) => delegate.account.address)
    logger.debug('Getting SUMR decay factors')
    const sumrDecayFactors = addresses.length > 0 ? await getSumrDecayFactor(addresses, logger) : []
    logger.debug(`Fetched ${sumrDecayFactors.length} SUMR decay factors`)

    await updateDelegates({ sumrDelegates, sumrDecayFactors, logger })
    logger.debug('update-tally-delegates handler completed')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    logger.error('Error updating tally delegates', { error: errorMessage })
  }
}

export default handler
