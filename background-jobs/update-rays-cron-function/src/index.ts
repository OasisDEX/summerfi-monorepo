import type { Context, EventBridgeEvent } from 'aws-lambda'
import { Logger } from '@aws-lambda-powertools/logger'
import { Database, getRaysDB } from '@summerfi/rays-db'
import { getBorrowDB } from '@summerfi/borrow-db'
import process from 'node:process'
import { getSummerPointsSubgraphClient } from '@summerfi/summer-events-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { PositionPoints, SummerPointsService } from './point-accrual'
import { positionIdResolver } from './position-id-resolver'
import { Kysely, Transaction } from 'kysely'

const logger = new Logger({ serviceName: 'update-rays-cron-function' })

const LOCK_ID = 'update_points_lock'
const LAST_RUN_ID = 'update_points_last_run'

const FOURTEEN_DAYS_IN_MILLISECONDS = 14 * 24 * 60 * 60 * 1000
const ONE_WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000

enum UserMultiplier {
  PROTOCOL_BOOST = 'PROTOCOL_BOOST',
  SWAP = 'SWAP',
}

enum RetroPointDistribution {
  SNAPSHOT_GENERAL = 'Snapshot_General',
  SNAPSHOT_DEFI = 'Snapshot_Defi',
  SNAPSHOT_SUMMER = 'Snapshot_Summer',
  SNAPSHOT_SUMMER_POWER = 'Snapshot_SummerPower',
}

enum OngoingPointDistribution {
  OPEN_POSITION = 'OPEN_POSITION',
  MIGRATION = 'MIGRATION',
  SWAP = 'SWAP',
  REFERRAL = 'REFERRAL',
}

enum PositionMultiplier {
  TIME_OPEN = 'TIME_OPEN',
  AUTOMATION = 'AUTOMATION',
  LAZY_VAULT = 'LAZY_VAULT',
}

enum EligibilityCondition {
  POSITION_OPEN_TIME = 'POSITION_OPEN_TIME',
  POINTS_EXPIRED = 'POINTS_EXPIRED',
  BECOME_SUMMER_USER = 'BECOME_SUMMER_USER',
}

type Eligibility = {
  type: EligibilityCondition
  description: string
  metadata: Record<string, string | number | Record<string, string | number | object>>
}

const eligibilityConditions: Record<EligibilityCondition, Eligibility> = {
  [EligibilityCondition.POSITION_OPEN_TIME]: {
    type: EligibilityCondition.POSITION_OPEN_TIME,
    description: 'The position must be open for at least 30 days',
    metadata: {
      minDays: 30,
    },
  },
  [EligibilityCondition.POINTS_EXPIRED]: {
    type: EligibilityCondition.POINTS_EXPIRED,
    description: 'The points have expired',
    metadata: {},
  },
  [EligibilityCondition.BECOME_SUMMER_USER]: {
    type: EligibilityCondition.BECOME_SUMMER_USER,
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
  const { SUBGRAPH_BASE, RAYS_DB_CONNECTION_STRING, BORROW_DB_READ_CONNECTION_STRING } = process.env

  logger.addContext(context)
  logger.info('Hello World!')

  if (!BORROW_DB_READ_CONNECTION_STRING) {
    logger.error('BORROW_DB_READ_CONNECTION_STRING is not set')
    return
  }
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
  const { db: borrowDb } = await getBorrowDB({
    connectionString: BORROW_DB_READ_CONNECTION_STRING,
    logger,
  })

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

    const { points: accruedPointsFromSnapshot, userSummary } =
      await pointAccuralService.getAccruedPointsAndUserDetails(startTimestamp, endTimestamp)

    // Get all unique addresses and positions from all chunks
    const allUniqueUsers: Set<string> = new Set()
    const uniqueUserAddressesFromSnapshot = Array.from(
      new Set(accruedPointsFromSnapshot.map((c) => c.user)),
    )

    const allPositions = Array.from(new Set(accruedPointsFromSnapshot.map((c) => c.positionId)))

    // addresses in borrow db are stored in checsummed addresses
    const usersFromReferralsTable = (
      await borrowDb
        .selectFrom('user')
        .where(borrowDb.fn('lower', ['user.address']), 'in', uniqueUserAddressesFromSnapshot)
        .selectAll()
        .execute()
    ).map((u) => ({
      address: u.address.toLowerCase(),
      accepted: u.accepted,
      timestamp: u.timestamp,
      user_that_referred_address: u.userThatReferredAddress
        ? u.userThatReferredAddress.toLowerCase()
        : null,
    }))

    for (const user of usersFromReferralsTable) {
      if (user.user_that_referred_address) {
        allUniqueUsers.add(user.user_that_referred_address)
      }
    }
    for (const user of uniqueUserAddressesFromSnapshot) {
      allUniqueUsers.add(user)
    }
    for (const user of userSummary) {
      allUniqueUsers.add(user.user)
    }
    const allUniqueUserAddresses = Array.from(allUniqueUsers)

    await checkMigrationEligibility(db, accruedPointsFromSnapshot)
    await checkOpenedPositionEligibility(db, accruedPointsFromSnapshot)
    await insertAllMissingUsers(db, allUniqueUserAddresses)

    // Fetch all necessary data for all chunks at once
    const uniqueUserAddressesFromDatabase = await db
      .selectFrom('userAddress')
      .where('address', 'in', allUniqueUserAddresses)
      .selectAll()
      .execute()

    const positionsFromDatabase = await db
      .selectFrom('position')
      .where('externalId', 'in', allPositions)
      .selectAll()
      .execute()

    const usersMultipliersFromDatabase = await db
      .selectFrom('multiplier')
      .innerJoin('userAddress', 'multiplier.userAddressId', 'userAddress.id')
      .where('userAddress.address', 'in', allUniqueUserAddresses)
      .select([
        'multiplier.value',
        'multiplier.type',
        'multiplier.id',
        'multiplier.userAddressId',
        'multiplier.positionId',
      ])
      .execute()
    const positionsMultipliersFromDatabase = await db
      .selectFrom('multiplier')
      .innerJoin('position', 'multiplier.positionId', 'position.id')
      .where('position.externalId', 'in', allPositions)
      .select([
        'multiplier.value',
        'multiplier.type',
        'multiplier.id',
        'multiplier.userAddressId',
        'multiplier.positionId',
      ])
      .execute()

    const chunkedPoints: PositionPoints[] = createChunksOfUserPointsDistributions(
      accruedPointsFromSnapshot,
      30,
    )

    await db.transaction().execute(async (transaction) => {
      await addOrUpdateUserMultipliers(
        uniqueUserAddressesFromSnapshot,
        uniqueUserAddressesFromDatabase,
        accruedPointsFromSnapshot,
        usersMultipliersFromDatabase,
        transaction,
      )

      for (let i = 0; i < chunkedPoints.length; i++) {
        const startTime = process.hrtime()
        logger.info(`Processing: Chunk ${i + 1} of ${chunkedPoints.length}`)
        const chunk = chunkedPoints[i]

        for (const record of chunk) {
          const userAddress = uniqueUserAddressesFromDatabase.find(
            (ua) => ua.address === record.user,
          )
          if (!userAddress) {
            throw new Error('User address not found')
          }

          const positionId = positionIdResolver(record.positionId)

          let position = positionsFromDatabase.find((p) => p.externalId === record.positionId)
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
                type: OngoingPointDistribution.OPEN_POSITION,
              })
              .executeTakeFirstOrThrow()

            const isUserReferred = usersFromReferralsTable.find((u) => u.address === record.user)
            if (isUserReferred && isUserReferred.user_that_referred_address) {
              const referringUser = uniqueUserAddressesFromDatabase.find(
                (ua) => ua.address === isUserReferred.user_that_referred_address,
              )
              if (!referringUser) {
                throw new Error('Referring user not found')
              }

              await transaction
                .insertInto('pointsDistribution')
                .values({
                  description: 'Points for referred user',
                  points: record.points.openPositionsPoints * 0.05,
                  userAddressId: referringUser.id,
                  type: OngoingPointDistribution.REFERRAL,
                })
                .executeTakeFirstOrThrow()
            }
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
                type: OngoingPointDistribution.MIGRATION,
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
                type: OngoingPointDistribution.SWAP,
              })
              .executeTakeFirstOrThrow()
          }

          // Multipliers
          // protocolBoostMultiplier: -> user multiplier -> type = 'PROTOCOL_BOOST'
          //     swapMultiplier: number -> user multiplier -> type = 'SWAP'
          //     timeOpenMultiplier: number -> position multiplier -> type = 'TIME_OPEN'
          //     automationProtectionMultiplier: number -> position multiplier -> type = PositionMultiplier.AUTOMATION
          //     lazyVaultMultiplier: number -> position multiplier -> type = 'LAZY_VAULT'

          const positionMultipliers = positionsMultipliersFromDatabase.filter(
            (m) => m.positionId === position.id,
          )

          let timeOpenMultiplier = positionMultipliers.find(
            (m) => m.type === PositionMultiplier.TIME_OPEN,
          )

          if (!timeOpenMultiplier) {
            timeOpenMultiplier = await transaction
              .insertInto('multiplier')
              .values({
                positionId: position.id,
                type: PositionMultiplier.TIME_OPEN,
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
            (m) => m.type === PositionMultiplier.AUTOMATION,
          )

          if (!automationProtectionMultiplier) {
            automationProtectionMultiplier = await transaction
              .insertInto('multiplier')
              .values({
                positionId: position.id,
                type: PositionMultiplier.AUTOMATION,
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

          const lazyVaultMultiplier = positionMultipliers.find(
            (m) => m.type === PositionMultiplier.LAZY_VAULT,
          )
          if (!lazyVaultMultiplier) {
            await transaction
              .insertInto('multiplier')
              .values({
                positionId: position.id,
                type: PositionMultiplier.LAZY_VAULT,
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
              positions: accruedPointsFromSnapshot.length,
            },
          })
          .executeTakeFirstOrThrow()

        await transaction
          .updateTable('updatePointsLastRun')
          .set('lastTimestamp', new Date(endTimestamp * 1000))
          .where('id', '=', LAST_RUN_ID)
          .execute()
        const endTime = process.hrtime(startTime)
        logger.info(
          `Chunk ${i} of ${chunkedPoints.length} took ${endTime[0]}s ${endTime[1] / 1000000}ms`,
        )
      }
    })
    await db.transaction().execute(async (transaction) => {
      for (const user of userSummary) {
        await transaction
          .updateTable('userAddress')
          .set({ details: user })
          .where('address', '=', user.user)
          .execute()
        if (user.ens) {
          await transaction
            .updateTable('userAddress')
            .set({ ens: user.ens })
            .where('address', '=', user.user)
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

/**
 * The `addOrUpdateUserMultipliers` function is an asynchronous function that updates or inserts multipliers for users.
 *
 * @param addressesFromSnapshot - An array of strings, where each string is an Ethereum or Solana address.
 *
 * @param uniqueUserAddressesFromDatabase - An array of objects, where each object represents a user address (from DB) . Each object has the following properties:
 *  - `address`: A string representing the Ethereum or Solana address of the user.
 *  - `createdAt`: A Date object representing when the user address was created.
 *  - `id`: A number representing the unique ID of the user address.
 *  - `type`: A string that can be either 'ETH' or 'SOL', representing the type of the address.
 *  - `updatedAt`: A Date object representing when the user address was last updated.
 *  - `userId`: A number representing the unique ID of the user.
 *
 * @param pointDistributions - An object representing the points of a position. The structure of this object depends on the `PositionPoints` type.
 *
 * @param usersMultipliersFromDatabase - An array of objects, where each object represents a multiplier. Each object has the following properties:
 *  - `userAddressId`: A number or null, representing the unique ID of the user address associated with the multiplier. If null, the multiplier is not associated with any user address.
 *  - `id`: A number representing the unique ID of the multiplier.
 *  - `type`: A string representing the type of the multiplier.
 *  - `positionId`: A number or null, representing the unique ID of the position associated with the multiplier. If null, the multiplier is not associated with any position.
 *  - `value`: A string representing the value of the multiplier.
 *
 * @param transaction - A Transaction object representing a database transaction. This transaction is used to execute the database operations.
 *
 * The function works as follows:
 * 1. It iterates over each address in the `addressesFromSnapshot` array.
 * 2. For each address, it finds the corresponding user address and points distribution.
 * 3. If no user address or points distribution is found, it throws an error.
 * 4. It then finds the multipliers associated with the user address.
 * 5. For each type of multiplier (protocol boost and swap), it checks if a multiplier already exists.
 * 6. If a multiplier does not exist, it inserts a new multiplier into the 'multiplier' table with the value from the points distribution.
 * 7. If a multiplier does exist, it updates the value of the multiplier in the 'multiplier' table with the value from the points distribution.
 */
async function addOrUpdateUserMultipliers(
  uniqueAddressesFromSnapshot: string[],
  uniqueUserAddressesFromDatabase: {
    address: string
    createdAt: Date
    id: number
    type: 'ETH' | 'SOL'
    updatedAt: Date
    userId: number
  }[],
  pointDistributionsFromSnapshot: PositionPoints,
  usersMultipliersFromDatabase: {
    userAddressId: number | null
    id: number
    type: string
    positionId: number | null
    value: string
  }[],
  transaction: Transaction<Database>,
) {
  for (const user of uniqueAddressesFromSnapshot) {
    const userAddress = uniqueUserAddressesFromDatabase.find((ua) => ua.address === user)
    // any points distribution attached to a specific user hold the same multipliers, hence we can take the first one
    const userPointsDistribution = pointDistributionsFromSnapshot.find((p) => p.user === user)

    if (!userPointsDistribution) {
      throw new Error('User points distribution not found')
    }
    if (!userAddress) {
      throw new Error('User address not found')
    }

    const userMultipliers = usersMultipliersFromDatabase.filter(
      (m) => m.userAddressId === userAddress.id,
    )
    let procotolBoostMultiplier = userMultipliers.find(
      (m) => m.type === UserMultiplier.PROTOCOL_BOOST,
    )
    if (!procotolBoostMultiplier) {
      procotolBoostMultiplier = await transaction
        .insertInto('multiplier')
        .values({
          userAddressId: userAddress.id,
          type: UserMultiplier.PROTOCOL_BOOST,
          value: userPointsDistribution.multipliers.protocolBoostMultiplier,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    } else {
      await transaction
        .updateTable('multiplier')
        .set('value', userPointsDistribution.multipliers.protocolBoostMultiplier)
        .where('id', '=', procotolBoostMultiplier.id)
        .execute()
    }

    let swapMultiplier = userMultipliers.find((m) => m.type === UserMultiplier.SWAP)

    if (!swapMultiplier) {
      swapMultiplier = await transaction
        .insertInto('multiplier')
        .values({
          userAddressId: userAddress.id,
          type: UserMultiplier.SWAP,
          value: userPointsDistribution.multipliers.swapMultiplier,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    } else {
      await transaction
        .updateTable('multiplier')
        .set('value', userPointsDistribution.multipliers.swapMultiplier)
        .where('id', '=', swapMultiplier.id)
        .execute()
    }
  }
}

/**
 * Inserts missing users into the database.
 *
 * @param sortedPoints - The sorted points containing user information.
 * @param db - The database instance.
 * @returns A Promise that resolves when all missing users are inserted.
 */
async function insertAllMissingUsers(db: Kysely<Database>, allUniqueUsers: string[]) {
  const uniqueUserAddressesFromDatabase = await db
    .selectFrom('userAddress')
    .where('address', 'in', Array.from(allUniqueUsers))
    .selectAll()
    .execute()

  const uniqueMissingUsers = allUniqueUsers.filter(
    (userAddress) => !uniqueUserAddressesFromDatabase.some((ua) => ua.address === userAddress),
  )

  await db.transaction().execute(async (transaction) => {
    for (const userAddress of uniqueMissingUsers) {
      await insertNewUser(transaction, userAddress)
    }
  })
}

async function insertNewUser(transaction: Transaction<Database>, userAddress: string) {
  const result = await transaction
    .insertInto('blockchainUser')
    .values({ category: null })
    .returning(['id'])
    .executeTakeFirstOrThrow()
  await transaction
    .insertInto('userAddress')
    .values({ address: userAddress, userId: result.id })
    .returningAll()
    .executeTakeFirstOrThrow()
  return result
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
  const existingOngoingPointDistributionsWithEligibilityCondition = await db
    .selectFrom('pointsDistribution')
    .select(['pointsDistribution.id as pointsId'])
    .innerJoin(
      'eligibilityCondition',
      'eligibilityCondition.id',
      'pointsDistribution.eligibilityConditionId',
    )
    .innerJoin('position', 'position.id', 'pointsDistribution.positionId')
    .where('eligibilityCondition.type', '=', eligibilityConditions.POSITION_OPEN_TIME.type)
    .where('pointsDistribution.type', '=', OngoingPointDistribution.MIGRATION)
    .selectAll()
    .execute()

  if (existingOngoingPointDistributionsWithEligibilityCondition.length > 0) {
    await db.transaction().execute(async (transaction) => {
      for (const point of existingOngoingPointDistributionsWithEligibilityCondition) {
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
  // get all position with net value >= 500 and created before 14 days ago, available in current snapshot
  const allEligiblePositionsFromPointsAccrual = positionPoints.filter((p) => {
    return (
      Number(p.netValue) >= 500 &&
      p.positionCreated * 1000 < Date.now() - FOURTEEN_DAYS_IN_MILLISECONDS
    )
  })

  const eligibleUsers = Array.from(
    new Set(allEligiblePositionsFromPointsAccrual.map((p) => p.user)),
  )

  // get all points distributions without an associated position id but with an eligibility condition for the eligilbe users
  const existingUsersWithEligibilityCondition = await db
    .selectFrom('pointsDistribution')
    .select(['pointsDistribution.id as pointsId'])
    .leftJoin(
      'eligibilityCondition',
      'eligibilityCondition.id',
      'pointsDistribution.eligibilityConditionId',
    )
    .leftJoin('userAddress', 'userAddress.id', 'pointsDistribution.userAddressId')
    .where('userAddress.address', 'in', eligibleUsers)
    .where((eb) =>
      eb('pointsDistribution.type', '=', RetroPointDistribution.SNAPSHOT_GENERAL).or(
        'pointsDistribution.type',
        '=',
        RetroPointDistribution.SNAPSHOT_DEFI,
      ),
    )
    .where('eligibilityCondition.type', '=', eligibilityConditions.BECOME_SUMMER_USER.type)
    .selectAll()
    .execute()

  if (existingUsersWithEligibilityCondition.length > 0) {
    await db.transaction().execute(async (transaction) => {
      for (const user of existingUsersWithEligibilityCondition) {
        if (user.dueDate && user.dueDate >= new Date()) {
          // filter all eligible positions for the user and sort them by creation date
          const eligiblePositionsFromPointsAccrual = allEligiblePositionsFromPointsAccrual
            .filter((p) => p.user === user.address)
            .sort((a, b) => a.positionCreated - b.positionCreated)

          if (eligiblePositionsFromPointsAccrual.length == 0) {
            continue
          } else {
            const oldestEligiblePosition = eligiblePositionsFromPointsAccrual[0]
            const becomeSummerUserMultiplier = getBecomeSummerUserMultiplier(
              oldestEligiblePosition.positionCreated,
            )
            const pointsDistributions = await transaction
              .selectFrom('pointsDistribution')
              .where('userAddressId', '=', user.id)
              .where((eb) =>
                eb('type', '=', RetroPointDistribution.SNAPSHOT_GENERAL).or(
                  'type',
                  '=',
                  RetroPointDistribution.SNAPSHOT_DEFI,
                ),
              )
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
  const positionCreatedDate = positionCreated * 1000
  const currentDate = Date.now()
  const weeksSinceCreated = Math.floor(
    (currentDate - positionCreatedDate) / ONE_WEEK_IN_MILLISECONDS,
  )

  let multiplier = 1

  if (weeksSinceCreated < 1) {
    multiplier = 5
  } else if (weeksSinceCreated < 2) {
    multiplier = 4
  } else if (weeksSinceCreated < 3) {
    multiplier = 3.5
  } else if (weeksSinceCreated < 4) {
    multiplier = 3
  } else if (weeksSinceCreated < 5) {
    multiplier = 2.5
  } else if (weeksSinceCreated < 6) {
    multiplier = 2
  } else if (weeksSinceCreated < 7) {
    multiplier = 1.5
  } else if (weeksSinceCreated < 8) {
    multiplier = 1.25
  } else {
    multiplier = 1
  }

  return multiplier
}
