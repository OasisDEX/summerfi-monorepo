import type { Context, EventBridgeEvent } from 'aws-lambda'
import { Logger } from '@aws-lambda-powertools/logger'
import { getRaysDB } from '@summerfi/rays-db'
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
  const { SUBGRAPH_BASE, RAYS_DB_CONNECTION_STRING } = process.env

  logger.addContext(context)
  logger.info('Hello World!')

  if (!SUBGRAPH_BASE) {
    logger.error('SUBGRAPH_BASE is not set')
    return
  }

  if (!RAYS_DB_CONNECTION_STRING) {
    logger.error('RAYS_DB_CONNECTION_STRING is not set')
    return
  }

  const dbConfig = {
    connectionString: RAYS_DB_CONNECTION_STRING,
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

        await trx
          .insertInto('pointsDistribution')
          .values({
            description: 'Points for opening a position',
            points: record.points.openPositionsPoints,
            positionId: position.id,
            type: 'OPEN_POSITION',
          })
          .execute()

        // Multipliers
        // protocolBoostMultiplier: -> user multiplier -> type = 'PROTOCOL_BOOST'
        //     swapMultiplier: number -> user multiplier -> type = 'SWAP'
        //     timeOpenMultiplier: number -> position multiplier -> type = 'TIME_OPEN'
        //     automationProtectionMultiplier: number -> position multiplier -> type = 'AUTOMATION'
        //     lazyVaultMultiplier: number -> position multiplier -> type = 'LAZY_VAULT'

        const userMultipliers = await trx
          .selectFrom('multiplier')
          .where('userAddressId', '=', userAddress.id)
          .selectAll()
          .execute()

        const positionMultipliers = await trx
          .selectFrom('multiplier')
          .where('positionId', '=', position.id)
          .selectAll()
          .execute()

        let procotolBoostMultiplier = userMultipliers.find((m) => m.type === 'PROTOCOL_BOOST')

        if (!procotolBoostMultiplier) {
          procotolBoostMultiplier = await trx
            .insertInto('multiplier')
            .values({
              userAddressId: userAddress.id,
              type: 'PROTOCOL_BOOST',
              value: record.multipliers.protocolBoostMultiplier,
            })
            .returningAll()
            .executeTakeFirstOrThrow()
        } else {
          await trx
            .updateTable('multiplier')
            .set('value', record.multipliers.protocolBoostMultiplier)
            .where('id', '=', procotolBoostMultiplier.id)
            .execute()
        }

        let swapMultiplier = userMultipliers.find((m) => m.type === 'SWAP')

        if (!swapMultiplier) {
          swapMultiplier = await trx
            .insertInto('multiplier')
            .values({
              userAddressId: userAddress.id,
              type: 'SWAP',
              value: record.multipliers.swapMultiplier,
            })
            .returningAll()
            .executeTakeFirstOrThrow()
        } else {
          await trx
            .updateTable('multiplier')
            .set('value', record.multipliers.swapMultiplier)
            .where('id', '=', swapMultiplier.id)
            .execute()
        }

        let timeOpenMultiplier = positionMultipliers.find((m) => m.type === 'TIME_OPEN')

        if (!timeOpenMultiplier) {
          timeOpenMultiplier = await trx
            .insertInto('multiplier')
            .values({
              positionId: position.id,
              type: 'TIME_OPEN',
              value: record.multipliers.timeOpenMultiplier,
            })
            .returningAll()
            .executeTakeFirstOrThrow()
        } else {
          await trx
            .updateTable('multiplier')
            .set('value', record.multipliers.timeOpenMultiplier)
            .where('id', '=', timeOpenMultiplier.id)
            .execute()
        }

        let automationProtectionMultiplier = positionMultipliers.find(
          (m) => m.type === 'AUTOMATION',
        )

        if (!automationProtectionMultiplier) {
          automationProtectionMultiplier = await trx
            .insertInto('multiplier')
            .values({
              positionId: position.id,
              type: 'AUTOMATION',
              value: record.multipliers.automationProtectionMultiplier,
            })
            .returningAll()
            .executeTakeFirstOrThrow()
        } else {
          await trx
            .updateTable('multiplier')
            .set('value', record.multipliers.automationProtectionMultiplier)
            .where('id', '=', automationProtectionMultiplier.id)
            .execute()
        }

        const lazyVaultMultiplier = positionMultipliers.find((m) => m.type === 'LAZY_VAULT')
        if (!lazyVaultMultiplier) {
          await trx
            .insertInto('multiplier')
            .values({
              positionId: position.id,
              type: 'LAZY_VAULT',
              value: record.multipliers.lazyVaultMultiplier,
            })
            .execute()
        } else {
          await trx
            .updateTable('multiplier')
            .set('value', record.multipliers.lazyVaultMultiplier)
            .where('id', '=', lazyVaultMultiplier.id)
            .execute()
        }
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
