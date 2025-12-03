import type { Context } from 'aws-lambda'
import { Logger } from '@aws-lambda-powertools/logger'
import process from 'node:process'
import { getSumrDelegates } from './get-sumr-delegates'
import { getSumrDecayFactor } from './get-sumr-decay-factor'
import { updateDelegates } from './update-delegates'

const logger = new Logger({ serviceName: 'update-tally-delegates', logLevel: 'DEBUG' })

const governanceV1Query = `{
          organizationId: "2439139313007462075"
          governorId: "eip155:8453:0xBE5A4DD68c3526F32B454fE28C9909cA0601e9Fa"
        }` // the tabs are important

const governanceV2Query = `{
          organizationId: "2734336916672481062"
          governorId: "eip155:8453:0x4cEeE1b6289624d381383C1Bb42B118d5f2c3274"
        }` // the tabs are important

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
    const [sumrDelegatesV1, sumrDelegatesV2] = await Promise.all([
      getSumrDelegates({ logger, filtersQuery: governanceV1Query }),
      getSumrDelegates({ logger, filtersQuery: governanceV2Query }),
    ])
    logger.debug(
      `Fetched SUMR delegates: ${sumrDelegatesV1.length} (V1), ${sumrDelegatesV2.length} (V2)`,
    )

    const addressesV1 = sumrDelegatesV1.map((delegate) => delegate.account.address)
    const addressesV2 = sumrDelegatesV2.map((delegate) => delegate.account.address)
    logger.debug('Getting SUMR decay factors')
    const [sumrDecayFactorsV1, sumrDecayFactorsV2] = await Promise.all([
      addressesV1.length > 0 ? getSumrDecayFactor(addressesV1, logger) : Promise.resolve([]),
      addressesV2.length > 0 ? getSumrDecayFactor(addressesV2, logger) : Promise.resolve([]),
    ])
    logger.debug(
      `Fetched SUMR decay factors: ${sumrDecayFactorsV1.length} (V1), ${sumrDecayFactorsV2.length} (V2)`,
    )

    await Promise.all([
      updateDelegates({
        sumrDelegates: sumrDelegatesV1,
        sumrDecayFactors: sumrDecayFactorsV1,
        logger,
        table: 'tallyDelegates',
      }),
      updateDelegates({
        sumrDelegates: sumrDelegatesV2,
        sumrDecayFactors: sumrDecayFactorsV2,
        logger,
        table: 'tallyDelegatesV2',
      }),
    ])
    logger.debug('update-tally-delegates handler completed')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    logger.error('Error updating tally delegates', { error: errorMessage })
  }
}

export default handler
