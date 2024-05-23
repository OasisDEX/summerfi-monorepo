import type { Context, EventBridgeEvent } from 'aws-lambda'
import { Logger } from '@aws-lambda-powertools/logger'
import { Database, getRaysDB } from '@summerfi/rays-db'
import process from 'node:process'
import { getSummerPointsSubgraphClient } from '@summerfi/summer-events-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { PositionPoints, SummerPointsService } from './point-accrual'
import { positionIdResolver } from './position-id-resolver'
import { Kysely } from 'kysely'

const logger = new Logger({ serviceName: 'update-rays-cron-function' })

const LOCK_ID = 'update_points_lock'
const LAST_RUN_ID = 'update_points_last_run'

const FOURTEEN_DAYS_IN_MILLISECONDS = 14 * 24 * 60 * 60 * 1000
const SIXTY_DAYS_IN_MILLISECONDS = 60 * 24 * 60 * 60
const THIRTY_DAYS_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000

enum EligibilityConditionType {
  POSITION_OPEN_TIME = 'POSITION_OPEN_TIME',
  POINTS_EXPIRED = 'POINTS_EXPIRED',
  BECOME_SUMMER_USER = 'BECOME_SUMMER_USER',
}
type Eligibility = {
  type: EligibilityConditionType
  description: string
  metadata: Record<string, string | number | Record<string, string | number | object>>
}

const eligibilityConditions: Record<EligibilityConditionType, Eligibility> = {
  [EligibilityConditionType.POSITION_OPEN_TIME]: {
    type: EligibilityConditionType.POSITION_OPEN_TIME,
    description: 'The position must be open for at least 30 days',
    metadata: {
      minDays: 30,
    },
  },
  [EligibilityConditionType.POINTS_EXPIRED]: {
    type: EligibilityConditionType.POINTS_EXPIRED,
    description: 'The points have expired',
    metadata: {},
  },
  [EligibilityConditionType.BECOME_SUMMER_USER]: {
    type: EligibilityConditionType.BECOME_SUMMER_USER,
    description: 'Must use summer for at least 14 days with at least 500 USD',
    metadata: {
      minDays: 14,
      minUsd: 500,
      bonus: {
        powerFeatureEnabled: 1000,
      },
      possibleMultipliers: {
        3: {
          requirements: 'Position open in first month',
        },
        2: {
          requirements: 'Position open in second month',
        },
      },
    },
  },
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

    await checkMigrationEligibility(db, sortedPoints)
    await checkOpenedPositionEligibility(db, sortedPoints)
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
                type: eligibilityConditions.POSITION_OPEN_TIME.type,
                description: eligibilityConditions.POSITION_OPEN_TIME.description,
                metadata: JSON.stringify(eligibilityConditions.POSITION_OPEN_TIME.metadata),
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

/**
 * Checks the migration eligibility for point distributions.
 * @param db - The database instance.
 * @param positionPoints - The position points.
 */
async function checkMigrationEligibility(db: Kysely<Database>, positionPoints: PositionPoints) {
  const existingPointDistributionsWithEligibilityCondition = await db
    .selectFrom('pointsDistribution')
    .where('positionId', '<>', null)
    .leftJoin(
      'eligibilityCondition',
      'eligibilityCondition.id',
      'pointsDistribution.eligibilityConditionId',
    )
    .leftJoin('position', 'position.id', 'pointsDistribution.positionId')
    .selectAll()
    .execute()

  if (existingPointDistributionsWithEligibilityCondition.length > 0) {
    existingPointDistributionsWithEligibilityCondition.forEach(async (point) => {
      if (
        point.dueDate &&
        point.type == eligibilityConditions.POSITION_OPEN_TIME.type &&
        point.dueDate < new Date()
      ) {
        const positionInSnapshot = positionPoints.find((p) => p.positionId === point.externalId)
        if (!positionInSnapshot || positionInSnapshot.netValue <= 0) {
          await db.deleteFrom('pointsDistribution').where('id', '=', point.id).execute()
          await db
            .deleteFrom('eligibilityCondition')
            .where('id', '=', point.eligibilityConditionId)
            .execute()
        } else if (positionInSnapshot.netValue > 0) {
          await db
            .updateTable('pointsDistribution')
            .set({ eligibilityConditionId: null })
            .where('id', '=', point.id)
            .execute()
          await db
            .deleteFrom('eligibilityCondition')
            .where('id', '=', point.eligibilityConditionId)
            .execute()
        }
      }
    })
  }
}

/**
 * This function checks the eligibility of opened positions.
 *
 * @param {Kysely<Database>} db - The Kysely database instance.
 * @param {PositionPoints[]} positionPoints - An array of position points.
 *
 * The function performs the following steps:
 * 1. Fetches all points distributions that have an associated eligibility condition but no associated position id.
 * 2. For each user with such a points distribution:
 *    a. If the due date has not passed and the type of the eligibility condition is `BECOME_SUMMER_USER`:
 *       i. Fetches all positions of the user that are eligible for a check. A position is eligible if its net value is greater than or equal to 500, it was created before 14 days ago, and it belongs to the current user.
 *       ii. If there are no eligible positions, the function returns.
 *       iii. Otherwise, it fetches user points distributions of certain types.
 *       iv. Updates each of them by setting the `eligibilityConditionId` to `null` and multiplying the points by a multiplier that depends on when the oldest eligible position was created.
 *    b. If the due date has passed and the type of the eligibility condition is `BECOME_SUMMER_USER`, it deletes all points distributions and the eligibility condition associated with the user.
 */
async function checkOpenedPositionEligibility(
  db: Kysely<Database>,
  positionPoints: PositionPoints,
) {
  // get all points distributions without an associated position id but with an eligibility condition
  const existingUsersWithEligibilityCondition = await db
    .selectFrom('pointsDistribution')
    .where('eligibilityConditionId', '<>', null)
    .where('positionId', '=', null)
    .leftJoin(
      'eligibilityCondition',
      'eligibilityCondition.id',
      'pointsDistribution.eligibilityConditionId',
    )
    .leftJoin('userAddress', 'userAddress.id', 'pointsDistribution.userAddressId')
    .selectAll()
    .execute()

  if (existingUsersWithEligibilityCondition.length > 0) {
    existingUsersWithEligibilityCondition.forEach(async (user) => {
      if (
        user.dueDate &&
        user.type == eligibilityConditions.BECOME_SUMMER_USER.type &&
        user.dueDate >= new Date()
      ) {
        // get all the positions of the user that are eligible for a check (exist in current points distribution)
        const eligiblePositionsFromPointsAccrual = positionPoints
          .filter(
            (p) =>
              p.netValue >= 500 &&
              p.positionCreated * 1000 < Date.now() - FOURTEEN_DAYS_IN_MILLISECONDS,
          )
          .filter((p) => p.user === user.address)
          .sort((a, b) => a.positionCreated - b.positionCreated)
        if (eligiblePositionsFromPointsAccrual.length == 0) {
          return
        } else {
          const oldestEligiblePosition = eligiblePositionsFromPointsAccrual[0]
          const becomeSummerUserMultiplier = getBecomeSummerUserMultiplier(
            oldestEligiblePosition.positionCreated,
          )

          const pointsDistributions = await db
            .selectFrom('pointsDistribution')
            .where('userAddressId', '=', user.id)
            .where((eb) => eb('type', '=', 'Snapshot_General').or('type', '=', 'Snapshot_Defi'))
            .selectAll()
            .execute()
          pointsDistributions.forEach(async (pointsDistribution) => {
            await db
              .updateTable('pointsDistribution')
              .set({
                eligibilityConditionId: null,
                points: +pointsDistribution.points * becomeSummerUserMultiplier,
              })
              .where('id', '=', pointsDistribution.id)
              .execute()
          })
        }
      } else if (
        user.dueDate &&
        user.type == eligibilityConditions.BECOME_SUMMER_USER.type &&
        user.dueDate < new Date()
      ) {
        // if the due date is exceeded we delete all the points distribution and the eligibility condition
        await db
          .deleteFrom('pointsDistribution')
          .where('eligibilityConditionId', '=', user.eligibilityConditionId)
          .execute()
        await db
          .deleteFrom('eligibilityCondition')
          .where('id', '=', user.eligibilityConditionId)
          .execute()
      }
    })
  }
}

/**
 * Calculates the multiplier for becoming a summer user based on the position creation date.
 * @param positionCreated The timestamp (in seconds) of when the position was created.
 * @returns The multiplier value.
 */
function getBecomeSummerUserMultiplier(positionCreated: number) {
  let multiplier = 1
  if (positionCreated * 1000 > Date.now() - THIRTY_DAYS_IN_MILLISECONDS) {
    multiplier = 3
  } else if (positionCreated * 1000 > Date.now() - SIXTY_DAYS_IN_MILLISECONDS) {
    multiplier = 2
  }
  return multiplier
}
