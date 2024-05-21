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

const eligibilityConditionType = 'POSITION_OPEN_TIME'
const eligibilityConditionDescription = 'The position must be open for at least 30 days'
const eligibilityConditionMetadata = {
  minDays: 30,
}

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
    logger,
  }
  const { db, services } = await getRaysDB(dbConfig)

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

  const lock = await services.updateLockService.getLock()

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

  const lastRun = Math.floor(lastRunTimestamp.lastTimestamp.getTime() / 1000) // Convert to seconds.
  const startTimestamp = lastRun + 1 // Convert to seconds.
  const endTimestamp = Math.floor(Date.now() / 1000) // Convert to seconds.

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

    logger.info(`Got: ${points.length} positions to update in the database`)

    const sortedPoints = points.sort((a, b) => a.positionId.localeCompare(b.positionId))

    // split points by 30 item chunks
    const chunkedPoints = []
    for (let i = 0; i < sortedPoints.length; i += 30) {
      chunkedPoints.push(sortedPoints.slice(i, i + 30))
    }
    for (let i = 0; i < chunkedPoints.length; i++) {
      logger.info(`Processing: Chunk ${i} of ${chunkedPoints.length}`)
      const chunk = chunkedPoints[i]
      const addressesForChunk = chunk.map((c) => c.user)
      const positionsForChunk = chunk.map((c) => c.positionId)

      const userAddresses = await db
        .selectFrom('userAddress')
        .where('address', 'in', addressesForChunk)
        .selectAll()
        .execute()
      const positions = await db
        .selectFrom('position')
        .where('externalId', 'in', positionsForChunk)
        .selectAll()
        .execute()

      const usersMultipliers = await db
        .selectFrom('multiplier')
        .innerJoin('userAddress', 'multiplier.userAddressId', 'userAddress.id')
        .where('userAddress.address', 'in', addressesForChunk)
        .select([
          'multiplier.value',
          'multiplier.type',
          'multiplier.id',
          'multiplier.userAddressId',
          'multiplier.positionId',
        ])
        .execute()

      const positionsMultipliers = await db
        .selectFrom('multiplier')
        .innerJoin('position', 'multiplier.positionId', 'position.id')
        .where('position.externalId', 'in', positionsForChunk)
        .select([
          'multiplier.value',
          'multiplier.type',
          'multiplier.id',
          'multiplier.userAddressId',
          'multiplier.positionId',
        ])
        .execute()

      await Promise.all(
        chunk.map(async (record) => {
          let userAddress = userAddresses.find((ua) => ua.address === record.user)

          if (!userAddress) {
            const result = await db
              .insertInto('blockchainUser')
              .values({ category: null })
              .returning(['id'])
              .executeTakeFirstOrThrow()
            userAddress = await db
              .insertInto('userAddress')
              .values({ address: record.user, userId: result.id })
              .returningAll()
              .executeTakeFirstOrThrow()
          }

          const positionId = positionIdResolver(record.positionId)

          let position = positions.find((p) => p.externalId === record.positionId)
          if (!position) {
            position = await db
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

          if (record.points.openPositionsPoints > 0) {
            await db
              .insertInto('pointsDistribution')
              .values({
                description: 'Points for opening a position',
                points: record.points.openPositionsPoints,
                positionId: position.id,
                type: 'OPEN_POSITION',
              })
              .executeTakeFirstOrThrow()
          }

          const currentDate = new Date()
          const dueDateTimestamp = currentDate.setDate(currentDate.getDate() + 30)
          const dueDate = new Date(dueDateTimestamp)

          if (record.points.migrationPoints > 0) {
            const eligibilityCondition = await db
              .insertInto('eligibilityCondition')
              .values({
                type: eligibilityConditionType,
                description: eligibilityConditionDescription,
                metadata: JSON.stringify(eligibilityConditionMetadata),
                dueDate: dueDate,
              })
              .returningAll()
              .executeTakeFirstOrThrow()

            await db
              .insertInto('pointsDistribution')
              .values({
                description: 'Points for migrations',
                points: record.points.migrationPoints,
                positionId: position.id,
                type: 'MIGRATION',
                eligibilityConditionId: eligibilityCondition.id,
              })
              .executeTakeFirstOrThrow()
          }

          if (record.points.swapPoints > 0) {
            await db
              .insertInto('pointsDistribution')
              .values({
                description: 'Points for swap',
                points: record.points.swapPoints,
                positionId: position.id,
                type: 'SWAP',
              })
              .executeTakeFirstOrThrow()
          }

          // Multipliers
          // protocolBoostMultiplier: -> user multiplier -> type = 'PROTOCOL_BOOST'
          //     swapMultiplier: number -> user multiplier -> type = 'SWAP'
          //     timeOpenMultiplier: number -> position multiplier -> type = 'TIME_OPEN'
          //     automationProtectionMultiplier: number -> position multiplier -> type = 'AUTOMATION'
          //     lazyVaultMultiplier: number -> position multiplier -> type = 'LAZY_VAULT'

          const userMultipliers = usersMultipliers.filter((m) => m.userAddressId === userAddress.id)
          const positionMultipliers = positionsMultipliers.filter(
            (m) => m.positionId === position.id,
          )

          let procotolBoostMultiplier = userMultipliers.find((m) => m.type === 'PROTOCOL_BOOST')

          if (!procotolBoostMultiplier) {
            procotolBoostMultiplier = await db
              .insertInto('multiplier')
              .values({
                userAddressId: userAddress.id,
                type: 'PROTOCOL_BOOST',
                value: record.multipliers.protocolBoostMultiplier,
              })
              .returningAll()
              .executeTakeFirstOrThrow()
          } else {
            await db
              .updateTable('multiplier')
              .set('value', record.multipliers.protocolBoostMultiplier)
              .where('id', '=', procotolBoostMultiplier.id)
              .execute()
          }

          let swapMultiplier = userMultipliers.find((m) => m.type === 'SWAP')

          if (!swapMultiplier) {
            swapMultiplier = await db
              .insertInto('multiplier')
              .values({
                userAddressId: userAddress.id,
                type: 'SWAP',
                value: record.multipliers.swapMultiplier,
              })
              .returningAll()
              .executeTakeFirstOrThrow()
          } else {
            await db
              .updateTable('multiplier')
              .set('value', record.multipliers.swapMultiplier)
              .where('id', '=', swapMultiplier.id)
              .execute()
          }

          let timeOpenMultiplier = positionMultipliers.find((m) => m.type === 'TIME_OPEN')

          if (!timeOpenMultiplier) {
            timeOpenMultiplier = await db
              .insertInto('multiplier')
              .values({
                positionId: position.id,
                type: 'TIME_OPEN',
                value: record.multipliers.timeOpenMultiplier,
              })
              .returningAll()
              .executeTakeFirstOrThrow()
          } else {
            await db
              .updateTable('multiplier')
              .set('value', record.multipliers.timeOpenMultiplier)
              .where('id', '=', timeOpenMultiplier.id)
              .execute()
          }

          let automationProtectionMultiplier = positionMultipliers.find(
            (m) => m.type === 'AUTOMATION',
          )

          if (!automationProtectionMultiplier) {
            automationProtectionMultiplier = await db
              .insertInto('multiplier')
              .values({
                positionId: position.id,
                type: 'AUTOMATION',
                value: record.multipliers.automationProtectionMultiplier,
              })
              .returningAll()
              .executeTakeFirstOrThrow()
          } else {
            await db
              .updateTable('multiplier')
              .set('value', record.multipliers.automationProtectionMultiplier)
              .where('id', '=', automationProtectionMultiplier.id)
              .execute()
          }

          const lazyVaultMultiplier = positionMultipliers.find((m) => m.type === 'LAZY_VAULT')
          if (!lazyVaultMultiplier) {
            await db
              .insertInto('multiplier')
              .values({
                positionId: position.id,
                type: 'LAZY_VAULT',
                value: record.multipliers.lazyVaultMultiplier,
              })
              .execute()
          } else {
            await db
              .updateTable('multiplier')
              .set('value', record.multipliers.lazyVaultMultiplier)
              .where('id', '=', lazyVaultMultiplier.id)
              .execute()
          }
        }),
      )

      logger.info(`Processed: Chunk ${i} of ${chunkedPoints.length}`)
    }

    await db
      .insertInto('updatePointsChangelog')
      .values({
        endTimestamp: new Date(endTimestamp * 1000),
        startTimestamp: new Date(startTimestamp * 1000),
        metadata: {
          positions: points.length,
        },
      })
      .executeTakeFirstOrThrow()

    await db
      .updateTable('updatePointsLastRun')
      .set('lastTimestamp', new Date(endTimestamp * 1000))
      .where('id', '=', LAST_RUN_ID)
      .execute()
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
