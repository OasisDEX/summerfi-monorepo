import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { SumrDelegates } from './get-sumr-delegates'
import { SumrDecayFactorData } from './get-sumr-decay-factor'
import { Logger } from '@aws-lambda-powertools/logger'

/**
 * Updates delegate information in the Summer Protocol database
 *
 * This function processes delegate data from Tally and updates the database with
 * current delegate information including voting power, delegator counts, and profile data.
 * It handles both insertions of new delegates and updates of existing ones using
 * upsert operations.
 *
 * It doesn't update the delegate's custom_* fields. Which are dedicated to the delegate's custom data which we can update on demand.
 *
 * @param {Object} params - The parameters object
 * @param {SumrDelegates[]} params.sumrDelegates - Array of delegate data from Tally
 * @param {SumrDecayFactorData[]} params.sumrDecayFactors - Array of decay factor data for vote power calculation
 * @param {Logger} params.logger - AWS Lambda Powertools logger instance for structured logging
 *
 * @returns {Promise<void>} Resolves when the database update is complete
 *
 * @throws {Error} When EARN_PROTOCOL_DB_CONNECTION_STRING environment variable is not set
 * @throws {Error} When database connection fails
 * @throws {Error} When delegate update operation fails
 *
 * @example
 * ```typescript
 * await updateDelegates({
 *   sumrDelegates: delegateData,
 *   sumrDecayFactors: decayFactorData,
 *   logger: new Logger()
 * })
 * ```
 */
export const updateDelegates = async ({
  sumrDelegates,
  sumrDecayFactors,
  logger,
  table,
}: {
  sumrDelegates: SumrDelegates[]
  sumrDecayFactors: SumrDecayFactorData[]
  logger: Logger
  table: 'tallyDelegates' | 'tallyDelegatesV2'
}) => {
  const { EARN_PROTOCOL_DB_CONNECTION_STRING } = process.env

  if (!EARN_PROTOCOL_DB_CONNECTION_STRING) {
    throw new Error('EARN_PROTOCOL_DB_CONNECTION_STRING is not set')
  }

  let database

  try {
    logger.info('Getting Summer Protocol DB')
    database = await getSummerProtocolDB({
      connectionString: EARN_PROTOCOL_DB_CONNECTION_STRING,
    })

    logger.info('Summer Protocol DB connected')

    try {
      logger.info('Updating delegates')
      const mappedDelegatesWithDecayFactors = sumrDelegates.map((delegate) => ({
        userAddress: delegate.account.address.toLowerCase(),
        displayName: delegate.account.name,
        ens: delegate.account.ens,
        x: delegate.account.twitter,
        bio:
          delegate.account.bio.length >= 600
            ? delegate.account.bio.slice(0, 597) + '...'
            : delegate.account.bio,
        photo: delegate.account.picture ?? '',
        votesCount: delegate.votesCount,
        votesCountNormalized: Number(delegate.votesCount) / 10 ** 18,
        delegatorsCount: delegate.delegatorsCount,
        votePower:
          sumrDecayFactors.find(
            (factor) => factor.address.toLowerCase() === delegate.account.address.toLowerCase(),
          )?.decayFactor ?? 0,
        updatedAt: Date.now(),
      }))

      logger.info('Inserting delegates')
      const result = await database.db
        .insertInto(table)
        .values(mappedDelegatesWithDecayFactors)
        .onConflict((oc) =>
          oc.columns(['userAddress']).doUpdateSet({
            displayName: (eb) => eb.ref('excluded.displayName'),
            ens: (eb) => eb.ref('excluded.ens'),
            x: (eb) => eb.ref('excluded.x'),
            bio: (eb) => eb.ref('excluded.bio'),
            photo: (eb) => eb.ref('excluded.photo'),
            votesCount: (eb) => eb.ref('excluded.votesCount'),
            votesCountNormalized: (eb) => eb.ref('excluded.votesCountNormalized'),
            delegatorsCount: (eb) => eb.ref('excluded.delegatorsCount'),
            votePower: (eb) => eb.ref('excluded.votePower'),
            updatedAt: (eb) => eb.ref('excluded.updatedAt'),
          }),
        )
        .execute()

      logger.info('Delegates updated', {
        numInsertedOrUpdatedRows: result[0].numInsertedOrUpdatedRows ?? 0,
      })
    } catch (error) {
      logger.error('Failed to update delegates', { error })
      throw error
    }
  } catch (error) {
    logger.error('Error getting Summer Protocol DB', { error })
    throw error
  } finally {
    await database?.db.destroy()
  }
}
