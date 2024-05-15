import type { Context, EventBridgeEvent } from 'aws-lambda'
import { Logger } from '@aws-lambda-powertools/logger'
import { getRaysDB } from '@summerfi/rays-db'
import { RDS } from 'sst/node/rds'
import { RDSData } from '@aws-sdk/client-rds-data'
import process from 'node:process'
import { getSummerPointsSubgraphClient } from '@summerfi/summer-events-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { SummerPointsService } from './point-accrual'
import { positionIdResolver } from './position-id-resolver'

const logger = new Logger({ serviceName: 'update-rays-cron-function' })

const LOCK_ID = 'update_points_lock'
const LAST_RUN_ID = 'update_points_last_run'

export const handler = async (
  event: EventBridgeEvent<'Scheduled Event', never>,
  context: Context,
): Promise<void> => {
  const SUBGRAPH_BASE = process.env.SUBGRAPH_BASE

  logger.addContext(context)
  logger.info('Hello World!')

  if (!SUBGRAPH_BASE) {
    logger.error('SUBGRAPH_BASE is not set')
    return
  }

  const dbConfig =
    process.env.IS_LOCAL === 'true'
      ? {
          connectionString: process.env.RAYS_DB_CONNECTION_STRING ?? '',
        }
      : {
          database: RDS['rays-database'].defaultDatabaseName,
          secretArn: RDS['rays-database'].secretArn,
          resourceArn: RDS['rays-database'].clusterArn,
          client: new RDSData({}),
        }

  const db = await getRaysDB(dbConfig)

  const mainnetSubgraphClient = getSummerPointsSubgraphClient({
    logger,
    chainId: ChainId.MAINNET,
    urlBase: SUBGRAPH_BASE,
  })

  const baseSubgraphClient = getSummerPointsSubgraphClient({
    logger,
    chainId: ChainId.BASE,
    urlBase: SUBGRAPH_BASE,
  })

  const optimismSubgraphClient = getSummerPointsSubgraphClient({
    logger,
    chainId: ChainId.OPTIMISM,
    urlBase: SUBGRAPH_BASE,
  })

  const arbitrumSubgraphClient = getSummerPointsSubgraphClient({
    logger,
    chainId: ChainId.ARBITRUM,
    urlBase: SUBGRAPH_BASE,
  })

  const clients = [
    mainnetSubgraphClient,
    baseSubgraphClient,
    optimismSubgraphClient,
    arbitrumSubgraphClient,
  ]

  const pointAccuralService = new SummerPointsService(clients, logger)

  const lastRunTimestamp = await db
    .selectFrom('updatePointsLastRun')
    .where('id', '=', LAST_RUN_ID)
    .select('lastTimestamp')
    .executeTakeFirst()

  const lock = await db
    .selectFrom('updatePointsLock')
    .where('id', '=', LOCK_ID)
    .select('isLocked')
    .executeTakeFirst()

  if (!lastRunTimestamp) {
    logger.error('Failed to get last run timestamp')
    return
  }

  if (!lock) {
    logger.error('Failed to get lock')
    return
  }

  if (lock.isLocked) {
    logger.info('Update points is already running')
    return
  }

  const lastRun = lastRunTimestamp.lastTimestamp.getTime() / 1000 // Convert to seconds.
  const startTimestamp = lastRunTimestamp.lastTimestamp.getTime() / 1000 + 1 // Convert to seconds.
  const endTimestamp = Date.now() / 1000 // Convert to seconds.

  logger.info('Trying to update points with parameters:', {
    lastRun,
    startTimestamp,
    endTimestamp,
  })

  try {
    const updatedLock = await db
      .updateTable('updatePointsLock')
      .set('isLocked', true)
      .where('id', '=', LOCK_ID)
      .executeTakeFirst()

    if (updatedLock.numUpdatedRows === 0n) {
      logger.error('Failed to lock update points')
      return
    }

    const points = await pointAccuralService.accruePoints(startTimestamp, endTimestamp)

    const tx = await db.transaction().execute(async (trx) => {
      for (const record of points) {
        let userAddress = await trx
          .selectFrom('userAddress')
          .where('address', '=', record.user)
          .selectAll()
          .executeTakeFirst()

        if (!userAddress) {
          const result = await trx
            .insertInto('blockchainUser')
            .values({ category: null })
            .returning(['id'])
            .executeTakeFirstOrThrow()
          userAddress = await trx
            .insertInto('userAddress')
            .values({ address: record.user, userId: result.id })
            .returningAll()
            .executeTakeFirstOrThrow()
        }

        const positionId = positionIdResolver(record.positionId)

        let position = await trx
          .selectFrom('position')
          .where('externalId', '=', record.positionId)
          .selectAll()
          .executeTakeFirst()
        if (!position) {
          position = await trx
            .insertInto('position')
            .values({
              externalId: record.positionId,
              market: record.marketId,
              protocol: positionId.protocol,
              type: positionId.positionType,
              userAddressId: userAddress.id,
              vaultId: record.vaultId,
              chainId: positionId.chainId,
              address: positionId.address,
            })
            .returningAll()
            .executeTakeFirstOrThrow()
        }

        // TODO: Insert points distributions & multipliers here.
      }
    })
  } catch (e) {
    logger.error('Failed to lock update points', { error: e })
    return
  } finally {
    logger.info('Releasing lock')
    await db
      .updateTable('updatePointsLock')
      .set('isLocked', false)
      .where('id', '=', LOCK_ID)
      .executeTakeFirst()
  }
}

export default handler
