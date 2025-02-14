import { Logger } from '@aws-lambda-powertools/logger'
import { getSummerProtocolDB, mapDbNetworkToChainId, Network } from '@summerfi/summer-protocol-db'
import {
  getAllClients as getAllRatesSubgraphClients,
  GetHistoricalArksRatesQuery,
} from '@summerfi/summer-earn-rates-subgraph'

import { Database } from '@summerfi/summer-protocol-db'
import { HistoricalVaultsQuery } from '@summerfi/summer-earn-protocol-subgraph'
import { Kysely, Transaction } from 'kysely'
// import { retrySubgraphQuery, updateHourlyVaultApr, updateDailyVaultApr, updateWeeklyVaultApr } from '..'
// import { HOUR_IN_SECONDS, DAY_IN_SECONDS, WEEK_IN_SECONDS, EPOCH_WEEK_OFFSET } from '..'
// import { NetworkStatus } from '..'
import {
  SubgraphClient as ProtocolSubgraphClient,
  VaultsQuery,
  getAllClients as getAllProtocolSubgraphClients,
} from '@summerfi/summer-earn-protocol-subgraph'
const logger = new Logger({ serviceName: 'backfill-fleet-rates' })

export interface NetworkStatus {
  network: Network
  isUpdating: boolean
  lastUpdatedAt: string
  lastBlockNumber: string
}

export const HOUR_IN_SECONDS = 3600
export const DAY_IN_SECONDS = 86400
export const WEEK_IN_SECONDS = 604800
export const EPOCH_WEEK_OFFSET = 345600 // 4 days
export const MIN_UPDATE_INTERVAL = 10 * 60 // 10 minutes in seconds
export async function retrySubgraphQuery<TResponse>(
  operation: () => Promise<TResponse>,
  options: {
    retries?: number
    initialDelay?: number
    logger: Logger
    context: {
      operation: string
      network: Network
      [key: string]: string | number | string[]
    }
  },
): Promise<TResponse> {
  const { retries = 5, initialDelay = 1000, logger, context } = options

  let currentRetry = retries
  let delay = initialDelay

  while (currentRetry > 0) {
    try {
      const result = await operation()
      return result
    } catch (error) {
      if (currentRetry === 1 || !(error instanceof Error) || !error.message.includes('429')) {
        logger.error(`Error in ${context.operation}:`, {
          ...context,
          error: error instanceof Error ? error : String(error),
        })
        throw error
      }

      currentRetry--
      logger.debug(`Rate limited, retrying ${context.operation}...`, {
        ...context,
        retriesLeft: currentRetry,
        delay,
      })
      await new Promise((resolve) => setTimeout(resolve, delay))
      delay *= 2 // Exponential backoff
    }
  }

  throw new Error(`Failed to complete ${context.operation} after all retries`)
}

// async function getEarliestRewardTimestamp(db: Kysely<Database>): Promise<number> {
//   const result = await db
//     .selectFrom('rewardRate')
//     .select('timestamp')
//     .orderBy('timestamp', 'asc')
//     .limit(1)
//     .executeTakeFirst()

//   if (!result?.timestamp) {
//     throw new Error('No reward rates found in database')
//   }
//   return +result.timestamp
// }

async function getHistoricalVaultData(
  protocolSubgraphClient: ProtocolSubgraphClient,
  blockNumber: number,
  network: NetworkStatus,
  logger: Logger,
) {
  return retrySubgraphQuery<HistoricalVaultsQuery>(
    () => protocolSubgraphClient.HistoricalVaults({ blockNumber }),
    {
      logger,
      context: {
        operation: 'GetHistoricalVaults',
        blockNumber,
        network: network.network,
      },
    },
  )
}

async function calculateAndStoreFleetRates(
  trx: Transaction<Database>,
  network: NetworkStatus,
  timestamp: number,
  vaultData: HistoricalVaultsQuery,
  arksRates: GetHistoricalArksRatesQuery,
  rewardRates: Array<{ productId: string; rate: string }>,
) {
  for (const vault of vaultData.vaults) {
    logger.info('Vault', { network: network.network, vaultId: vault.id, arks: vault.arks })
    const bufferArk = vault.arks.find(
      (ark) => ark.name === 'BufferArk' && ark.vault.id === vault.id,
    )
    logger.info('Buffer ark', { network: network.network, vaultId: vault.id, bufferArk })
    const arksWithTvl = vault.arks
      .filter((ark) => +ark.totalValueLockedUSD > 0)
      .concat(bufferArk ? [bufferArk] : [])
    logger.info('Arks with tvl', { network: network.network, vaultId: vault.id, arksWithTvl })
    const fleetTvl = arksWithTvl.reduce((acc, ark) => acc + +ark.totalValueLockedUSD, 0)
    let weightedFleetRate = 0
    if (fleetTvl > 0) {
      logger.info('Fleet tvl', { network: network.network, vaultId: vault.id, fleetTvl })
      const fleetArksWithRatios = arksWithTvl.map((ark) => ({
        ...ark,
        ratio: +ark.totalValueLockedUSD / fleetTvl,
      }))
      logger.info('Fleet arks with ratios', {
        network: network.network,
        vaultId: vault.id,
        fleetArksWithRatios,
      })
      // Create a map of product rates
      const productRatesMap = new Map(
        arksRates.products.flatMap((product) =>
          product.interestRates.map((rate) => [rate.productId, rate.rate]),
        ),
      )
      logger.info('Product rates map', {
        network: network.network,
        vaultId: vault.id,
        productRatesMap,
      })
      // Create a map of reward rates
      const rewardRatesMap = new Map(rewardRates.map((rate) => [rate.productId, rate.rate]))
      logger.info('Reward rates map', {
        network: network.network,
        vaultId: vault.id,
        rewardRatesMap,
      })
      // Calculate weighted fleet rate
      weightedFleetRate = fleetArksWithRatios.reduce((acc, ark) => {
        const baseRate = +(productRatesMap.get(ark.productId) || '0')
        const rewardRate = +(rewardRatesMap.get(ark.productId) || '0')
        const totalRate = baseRate + rewardRate
        return acc + totalRate * ark.ratio
      }, 0)
      logger.info('Weighted fleet rate', {
        network: network.network,
        vaultId: vault.id,
        weightedFleetRate,
      })
    } else {
      weightedFleetRate = 0
    }
    // Calculate period timestamps
    const hourTimestamp = Math.floor(timestamp / HOUR_IN_SECONDS) * HOUR_IN_SECONDS
    const dayTimestamp = Math.floor(timestamp / DAY_IN_SECONDS) * DAY_IN_SECONDS
    const offsetTimestamp = timestamp + EPOCH_WEEK_OFFSET
    const weekTimestamp =
      Math.floor(offsetTimestamp / WEEK_IN_SECONDS) * WEEK_IN_SECONDS - EPOCH_WEEK_OFFSET
    logger.info('Period timestamps', {
      network: network.network,
      vaultId: vault.id,
      hourTimestamp,
      dayTimestamp,
      weekTimestamp,
    })
    // Store fleet interest rate
    logger.info('Storing fleet interest rate', {
      network: network.network,
      vaultId: vault.id,
      timestamp,
    })
    await trx
      .insertInto('fleetInterestRate')
      .values({
        id: `${network.network}-${vault.id}-${timestamp}`,
        timestamp,
        rate: weightedFleetRate.toString(),
        network: network.network,
        fleetAddress: vault.id,
      })
      .execute()
    logger.info('Stored fleet interest rate', {
      network: network.network,
      vaultId: vault.id,
      timestamp,
    })
    // Update averages
    await updateHourlyVaultApr(trx, network, weightedFleetRate.toString(), hourTimestamp, vault.id)
    await updateDailyVaultApr(trx, network, weightedFleetRate.toString(), dayTimestamp, vault.id)
    await updateWeeklyVaultApr(trx, network, weightedFleetRate.toString(), weekTimestamp, vault.id)
  }
}
export async function updateHourlyVaultApr(
  trx: Transaction<Database>,
  network: NetworkStatus,
  newRate: string,
  hourTimestamp: number,
  fleetAddress: string,
) {
  const hourlyRateId = `${network.network}-${fleetAddress}-${hourTimestamp}`

  const hourlyRate = await trx
    .selectFrom('hourlyFleetInterestRate')
    .where('id', '=', hourlyRateId)
    .selectAll()
    .executeTakeFirst()

  if (!hourlyRate) {
    await trx
      .insertInto('hourlyFleetInterestRate')
      .values({
        id: hourlyRateId,
        date: hourTimestamp,
        sumRates: newRate,
        updateCount: 1,
        averageRate: newRate,
        network: network.network,
        fleetAddress,
      })
      .execute()
  } else {
    const newSum = (parseFloat(hourlyRate.sumRates) + parseFloat(newRate)).toString()
    const newCount = +hourlyRate.updateCount + 1
    const newAverage = (parseFloat(newSum) / newCount).toString()

    await trx
      .updateTable('hourlyFleetInterestRate')
      .set({
        sumRates: newSum,
        updateCount: newCount,
        averageRate: newAverage,
      })
      .where('id', '=', hourlyRateId)
      .execute()
  }
}

export async function updateDailyVaultApr(
  trx: Transaction<Database>,
  network: NetworkStatus,
  newRate: string,
  dayTimestamp: number,
  fleetAddress: string,
) {
  const dailyRateId = `${network.network}-${fleetAddress}-${dayTimestamp}`

  const dailyRate = await trx
    .selectFrom('dailyFleetInterestRate')
    .where('id', '=', dailyRateId)
    .selectAll()
    .executeTakeFirst()

  if (!dailyRate) {
    await trx
      .insertInto('dailyFleetInterestRate')
      .values({
        id: dailyRateId,
        date: dayTimestamp,
        sumRates: newRate,
        updateCount: 1,
        averageRate: newRate,
        network: network.network,
        fleetAddress,
      })
      .execute()
  } else {
    const newSum = (parseFloat(dailyRate.sumRates) + parseFloat(newRate)).toString()
    const newCount = +dailyRate.updateCount + 1
    const newAverage = (parseFloat(newSum) / newCount).toString()

    await trx
      .updateTable('dailyFleetInterestRate')
      .set({
        sumRates: newSum,
        updateCount: newCount,
        averageRate: newAverage,
      })
      .where('id', '=', dailyRateId)
      .execute()
  }
}

export async function updateWeeklyVaultApr(
  trx: Transaction<Database>,
  network: NetworkStatus,
  newRate: string,
  weekTimestamp: number,
  fleetAddress: string,
) {
  const weeklyRateId = `${network.network}-${fleetAddress}-${weekTimestamp}`

  const weeklyRate = await trx
    .selectFrom('weeklyFleetInterestRate')
    .where('id', '=', weeklyRateId)
    .selectAll()
    .executeTakeFirst()

  if (!weeklyRate) {
    await trx
      .insertInto('weeklyFleetInterestRate')
      .values({
        id: weeklyRateId,
        weekTimestamp,
        sumRates: newRate,
        updateCount: 1,
        averageRate: newRate,
        network: network.network,
        fleetAddress,
      })
      .execute()
  } else {
    const newSum = (parseFloat(weeklyRate.sumRates) + parseFloat(newRate)).toString()
    const newCount = +weeklyRate.updateCount + 1
    const newAverage = (parseFloat(newSum) / newCount).toString()

    await trx
      .updateTable('weeklyFleetInterestRate')
      .set({
        sumRates: newSum,
        updateCount: newCount,
        averageRate: newAverage,
      })
      .where('id', '=', weeklyRateId)
      .execute()
  }
}
export async function backfillFleetRates() {
  const { SUBGRAPH_BASE, EARN_PROTOCOL_DB_CONNECTION_STRING } = process.env

  if (!EARN_PROTOCOL_DB_CONNECTION_STRING || !SUBGRAPH_BASE) {
    throw new Error('Missing required environment variabdles')
  }

  const { db } = await getSummerProtocolDB({
    connectionString: EARN_PROTOCOL_DB_CONNECTION_STRING,
  })

  const startTimestamp = 1739228400
  const endTimestamp = Math.floor(Date.now() / 1000)

  logger.info('Starting backfill', { startTimestamp, endTimestamp })

  const allNetworks = (await db.selectFrom('networkStatus').selectAll().execute()).filter(
    (network) => network.network == 'mainnet',
  )

  const ratesSubgraphClients = getAllRatesSubgraphClients(SUBGRAPH_BASE)
  const protocolSubgraphClients = getAllProtocolSubgraphClients(SUBGRAPH_BASE)

  for (const network of allNetworks) {
    const chainId = mapDbNetworkToChainId(network.network)
    const ratesClient = ratesSubgraphClients[chainId]
    const protocolClient = protocolSubgraphClients[chainId]

    const vaults = await retrySubgraphQuery<VaultsQuery>(() => protocolClient.Vaults(), {
      logger,
      context: { operation: 'GetVaults', network: network.network },
    })
    const productIds = vaults.vaults.flatMap((vault) => vault.arks.map((ark) => ark.productId))

    // Get all historical rates for this network
    const historicalRates = await retrySubgraphQuery<GetHistoricalArksRatesQuery>(
      () =>
        ratesClient.GetHistoricalArksRates({
          productIds,
          timestamp: startTimestamp,
        }),
      {
        logger,
        context: {
          operation: 'GetHistoricalArksRates',
          network: network.network,
          startTimestamp,
        },
      },
    )
    const blockTimestampMap = historicalRates.products[0].interestRates.map((rate) => [
      +rate.blockNumber,
      +rate.timestamp,
    ])

    // Process each timestamp interval
    for (const blockTimestamp of blockTimestampMap) {
      try {
        await db.transaction().execute(async (trx) => {
          // Check for existing data
          const existing = await trx
            .selectFrom('fleetInterestRate')
            .where('timestamp', '=', blockTimestamp[1].toString())
            .where('network', '=', network.network)
            .executeTakeFirst()

          if (existing) {
            logger.debug('Data exists, skipping', {
              block: blockTimestamp[1],
              network: network.network,
            })
            return
          }

          // Find closest rates before this timestamp
          const timestamp = blockTimestamp[1]
          const relevantRates = historicalRates.products
            .map((product) => {
              // Sort rates in descending order so first match is the closest one
              const sortedRates = [...product.interestRates].sort(
                (a, b) => +b.timestamp - +a.timestamp,
              )
              const closestRate = sortedRates.find((rate) => +rate.timestamp <= timestamp)

              if (!closestRate) return null

              return {
                id: product.id,
                interestRates: [closestRate],
              }
            })
            .filter((product): product is NonNullable<typeof product> => product !== null)
          logger.info('Relevant rates', { network: network.network, relevantRates })
          if (relevantRates.length === 0) {
            logger.debug('No relevant rates found', {
              block: blockTimestamp[1],
              network: network.network,
            })
            return
          }

          // Get vault data using block number from rates
          const blockNumber = blockTimestamp[0]
          const vaultData = await getHistoricalVaultData(
            protocolClient,
            blockNumber,
            network,
            logger,
          )

          // Get reward rates for this timestamp
          const rewardRates = await trx
            .with('latest_timestamps', (qb) =>
              qb
                .selectFrom('rewardRate')
                .select(['productId', 'network'])
                .select((eb) => eb.fn.max('timestamp').as('maxTimestamp'))
                .where('network', '=', network.network)
                .where('timestamp', '<=', blockTimestamp[1].toString())
                .where(
                  'productId',
                  'in',
                  relevantRates.map((p) => p.interestRates[0].productId),
                )
                .groupBy(['productId', 'network']),
            )
            .selectFrom('rewardRate')
            .innerJoin('latest_timestamps', (join) =>
              join
                .onRef('rewardRate.productId', '=', 'latest_timestamps.productId')
                .onRef('rewardRate.network', '=', 'latest_timestamps.network')
                .onRef('rewardRate.timestamp', '=', 'latest_timestamps.maxTimestamp'),
            )
            .selectAll('rewardRate')
            .execute()

          await calculateAndStoreFleetRates(
            trx,
            network,
            blockTimestamp[1],
            vaultData,
            { products: relevantRates },
            rewardRates,
          )

          logger.info('Processed block', { block: blockTimestamp[0], network: network.network })
        })
      } catch (error) {
        logger.error('Error processing block', {
          block: blockTimestamp[0],
          network: network.network,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
  }

  logger.info('Backfill completed')
}

// backfillFleetRates().catch((error) => {
//     logger.error('Script failed', {
//         error: error instanceof Error ? error.message : String(error),
//     })
//     process.exit(1)
// })
