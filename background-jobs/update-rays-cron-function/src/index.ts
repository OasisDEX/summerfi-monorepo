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
    const sortedPoints = points.sort((a, b) => a.positionId.localeCompare(b.positionId))

    await checkMigrationEligibility(db, sortedPoints)
    await checkOpenedPositionEligibility(db, sortedPoints)
    await insertAllMissingUsers(sortedPoints, db)

    const chunkedPoints: PositionPoints[] = createChunksOfUserPointsDistributions(sortedPoints, 30)
    await db.transaction().execute(async (transaction) => {
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

        for (const record of chunk) {
          const userAddress = userAddresses.find((ua) => ua.address === record.user)
          if (!userAddress) {
            throw new Error('User address not found')
          }

          const positionId = positionIdResolver(record.positionId)

          let position = positions.find((p) => p.externalId === record.positionId)
          if (!position) {
            position = await transaction
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
            await transaction
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
            const eligibilityCondition = await transaction
              .insertInto('eligibilityCondition')
              .values({
                type: eligibilityConditions.POSITION_OPEN_TIME.type,
                description: eligibilityConditions.POSITION_OPEN_TIME.description,
                metadata: JSON.stringify(eligibilityConditions.POSITION_OPEN_TIME.metadata),
                dueDate: dueDate,
              })
              .returningAll()
              .executeTakeFirstOrThrow()

            await transaction
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
            await transaction
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
            procotolBoostMultiplier = await transaction
              .insertInto('multiplier')
              .values({
                userAddressId: userAddress.id,
                type: 'PROTOCOL_BOOST',
                value: record.multipliers.protocolBoostMultiplier,
              })
              .returningAll()
              .executeTakeFirstOrThrow()
          } else {
            await transaction
              .updateTable('multiplier')
              .set('value', record.multipliers.protocolBoostMultiplier)
              .where('id', '=', procotolBoostMultiplier.id)
              .execute()
          }

          let swapMultiplier = userMultipliers.find((m) => m.type === 'SWAP')

          if (!swapMultiplier) {
            swapMultiplier = await transaction
              .insertInto('multiplier')
              .values({
                userAddressId: userAddress.id,
                type: 'SWAP',
                value: record.multipliers.swapMultiplier,
              })
              .returningAll()
              .executeTakeFirstOrThrow()
          } else {
            await transaction
              .updateTable('multiplier')
              .set('value', record.multipliers.swapMultiplier)
              .where('id', '=', swapMultiplier.id)
              .execute()
          }

          let timeOpenMultiplier = positionMultipliers.find((m) => m.type === 'TIME_OPEN')

          if (!timeOpenMultiplier) {
            timeOpenMultiplier = await transaction
              .insertInto('multiplier')
              .values({
                positionId: position.id,
                type: 'TIME_OPEN',
                value: record.multipliers.timeOpenMultiplier,
              })
              .returningAll()
              .executeTakeFirstOrThrow()
          } else {
            await transaction
              .updateTable('multiplier')
              .set('value', record.multipliers.timeOpenMultiplier)
              .where('id', '=', timeOpenMultiplier.id)
              .execute()
          }

          let automationProtectionMultiplier = positionMultipliers.find(
            (m) => m.type === 'AUTOMATION',
          )

          if (!automationProtectionMultiplier) {
            automationProtectionMultiplier = await transaction
              .insertInto('multiplier')
              .values({
                positionId: position.id,
                type: 'AUTOMATION',
                value: record.multipliers.automationProtectionMultiplier,
              })
              .returningAll()
              .executeTakeFirstOrThrow()
          } else {
            await transaction
              .updateTable('multiplier')
              .set('value', record.multipliers.automationProtectionMultiplier)
              .where('id', '=', automationProtectionMultiplier.id)
              .execute()
          }

          const lazyVaultMultiplier = positionMultipliers.find((m) => m.type === 'LAZY_VAULT')
          if (!lazyVaultMultiplier) {
            await transaction
              .insertInto('multiplier')
              .values({
                positionId: position.id,
                type: 'LAZY_VAULT',
                value: record.multipliers.lazyVaultMultiplier,
              })
              .execute()
          } else {
            await transaction
              .updateTable('multiplier')
              .set('value', record.multipliers.lazyVaultMultiplier)
              .where('id', '=', lazyVaultMultiplier.id)
              .execute()
          }
        }
        // tutj
        logger.info(`Processed: Chunk ${i} of ${chunkedPoints.length}`)

        await transaction
          .insertInto('updatePointsChangelog')
          .values({
            endTimestamp: new Date(endTimestamp * 1000),
            startTimestamp: new Date(startTimestamp * 1000),
            metadata: {
              positions: points.length,
            },
          })
          .executeTakeFirstOrThrow()

        await transaction
          .updateTable('updatePointsLastRun')
          .set('lastTimestamp', new Date(endTimestamp * 1000))
          .where('id', '=', LAST_RUN_ID)
          .execute()
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

/**
 * Inserts missing users into the database.
 *
 * @param sortedPoints - The sorted points containing user information.
 * @param db - The database instance.
 * @returns A Promise that resolves when all missing users are inserted.
 */
async function insertAllMissingUsers(sortedPoints: PositionPoints, db: Kysely<Database>) {
  const uniqueUsers = new Set(sortedPoints.map((p) => p.user))
  const userAddresses = await db
    .selectFrom('userAddress')
    .where('address', 'in', Array.from(uniqueUsers))
    .selectAll()
    .execute()

  await db.transaction().execute(async (transaction) => {
    for (const user of uniqueUsers) {
      const userAddress = userAddresses.find((ua) => ua.address === user)
      if (!userAddress) {
        const result = await transaction
          .insertInto('blockchainUser')
          .values({ category: null })
          .returning(['id'])
          .executeTakeFirstOrThrow()
        await transaction
          .insertInto('userAddress')
          .values({ address: user, userId: result.id })
          .returningAll()
          .executeTakeFirstOrThrow()
      }
    }
  })
}

/**
 * Creates chunks of user points distributions based on a given chunk length.
 *
 * @remarks This function is used to create chunks of user points distributions based on a given chunk length
 * and the fact each points distributions per user can't be split between chunks.
 *
 * @param sortedPoints - An array of points sorted by user.
 * @param chunkLength - The desired length of each chunk.
 * @returns An array of chunks, where each chunk contains points for each user.
 */
function createChunksOfUserPointsDistributions(sortedPoints: PositionPoints, chunkLength: number) {
  // Create a map where the keys are the users and the values are arrays of points for each user.
  const pointsByUser = new Map<string, PositionPoints>()
  for (const point of sortedPoints) {
    const userPoints = pointsByUser.get(point.user) || []
    userPoints.push(point)
    pointsByUser.set(point.user, userPoints)
  }
  const chunkedPoints: PositionPoints[] = []
  let currentChunk: PositionPoints = []
  for (const userPoints of pointsByUser.values()) {
    if (currentChunk.length + userPoints.length >= chunkLength) {
      chunkedPoints.push(currentChunk)
      currentChunk = []
    }
    currentChunk.push(...userPoints)
  }
  if (currentChunk.length > 0) {
    chunkedPoints.push(currentChunk)
  }
  return chunkedPoints
}

/**
 * Checks the migration eligibility for point distributions.
 * @param db - The database instance.
 * @param positionPoints - The position points.
 */
async function checkMigrationEligibility(db: Kysely<Database>, positionPoints: PositionPoints) {
  const existingPointDistributionsWithEligibilityCondition = await db
    .selectFrom('pointsDistribution')
    .select(['pointsDistribution.id as pointsId'])
    .innerJoin(
      'eligibilityCondition',
      'eligibilityCondition.id',
      'pointsDistribution.eligibilityConditionId',
    )
    .innerJoin('position', 'position.id', 'pointsDistribution.positionId')
    .where('eligibilityCondition.type', '=', eligibilityConditions.POSITION_OPEN_TIME.type)
    .where('pointsDistribution.type', '=', 'MIGRATION')
    .selectAll()
    .execute()

  if (existingPointDistributionsWithEligibilityCondition.length > 0) {
    await db.transaction().execute(async (transaction) => {
      for (const point of existingPointDistributionsWithEligibilityCondition) {
        if (point.dueDate && point.dueDate < new Date()) {
          const positionInSnapshot = positionPoints.find((p) => p.positionId === point.externalId)
          if (!positionInSnapshot || positionInSnapshot.netValue <= 0) {
            await transaction
              .deleteFrom('pointsDistribution')
              .where('id', '=', point.pointsId)
              .execute()
            await transaction
              .deleteFrom('eligibilityCondition')
              .where('id', '=', point.eligibilityConditionId)
              .execute()
          } else if (positionInSnapshot.netValue > 0) {
            await transaction
              .updateTable('pointsDistribution')
              .set({ eligibilityConditionId: null })
              .where('id', '=', point.pointsId)
              .execute()
            await transaction
              .deleteFrom('eligibilityCondition')
              .where('id', '=', point.eligibilityConditionId)
              .execute()
          }
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
    .select(['pointsDistribution.id as pointsId'])
    .leftJoin(
      'eligibilityCondition',
      'eligibilityCondition.id',
      'pointsDistribution.eligibilityConditionId',
    )
    .leftJoin('userAddress', 'userAddress.id', 'pointsDistribution.userAddressId')
    .where('eligibilityCondition.type', '=', eligibilityConditions.BECOME_SUMMER_USER.type)
    .selectAll()
    .execute()

  if (existingUsersWithEligibilityCondition.length > 0) {
    await db.transaction().execute(async (transaction) => {
      for (const user of existingUsersWithEligibilityCondition) {
        if (user.dueDate && user.dueDate >= new Date()) {
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
            const pointsDistributions = await transaction
              .selectFrom('pointsDistribution')
              .where('userAddressId', '=', user.id)
              .where((eb) => eb('type', '=', 'Snapshot_General').or('type', '=', 'Snapshot_Defi'))
              .selectAll()
              .execute()
            for (const pointsDistribution of pointsDistributions) {
              // update points distribution
              await transaction
                .updateTable('pointsDistribution')
                .set({
                  eligibilityConditionId: null,
                  points: +pointsDistribution.points * becomeSummerUserMultiplier,
                })
                .where('id', '=', pointsDistribution.id)
                .execute()
            }
          }
        } else if (user.dueDate && user.dueDate < new Date()) {
          // removes all points distributions and eligibility condition - there is one due date for all retro snapshot distributions
          await transaction
            .deleteFrom('pointsDistribution')
            .where('eligibilityConditionId', '=', user.eligibilityConditionId)
            .execute()
          await transaction
            .deleteFrom('eligibilityCondition')
            .where('id', '=', user.eligibilityConditionId)
            .execute()
        }
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
