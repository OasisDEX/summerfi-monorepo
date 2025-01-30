import type { Context, EventBridgeEvent } from 'aws-lambda'
import { Logger } from '@aws-lambda-powertools/logger'
import { getSummerProtocolDB, Network } from '@summerfi/summer-protocol-db'
import process from 'node:process'
import {
  getAllClients,
  SubgraphClient
} from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { RewardsService } from './rewards-service'
import { Transaction } from 'kysely'
import { Database } from '@summerfi/summer-protocol-db'

const logger = new Logger({ serviceName: 'update-rays-cron-function' })

const networkToChainId: Record<string, ChainId> = {
  arbitrum: ChainId.ARBITRUM,
  optimism: ChainId.OPTIMISM,
  base: ChainId.BASE,
  mainnet: ChainId.MAINNET
}

const supportedProductIds: Record<ChainId, string[]> = {
  [ChainId.ARBITRUM]: [],
  [ChainId.OPTIMISM]: [],
  [ChainId.BASE]: ['Morpho-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913-0xc1256ae5ff1cf2719d4937adb3bbccab2e00a2ca-8453'],
  [ChainId.MAINNET]: ['Euler-0xdac17f958d2ee523a2206206994597c13d831ec7-0x7c280dbdef569e96c7919251bd2b0edf0734c5a8-1'],
  [ChainId.SEPOLIA]: []
}

const rewardsService = new RewardsService()

interface NetworkStatus {
  network: Network
  isUpdating: boolean
  lastUpdatedAt: string
  lastBlockNumber: string
}

const HOUR_IN_SECONDS = 3600
const DAY_IN_SECONDS = 86400
const WEEK_IN_SECONDS = 604800
const EPOCH_WEEK_OFFSET = 345600 // 4 days
const MIN_UPDATE_INTERVAL = 10 * 60 // 10 minutes in seconds

async function updateRewardRates(
  trx: Transaction<Database>,
  network: NetworkStatus,
  productId: string,
) {
  const rewardRates = await rewardsService.getRewardRates(productId)
  const currentTimestamp = Math.floor(Date.now() / 1000)

  // First ensure all reward tokens exist
  for (const rewardRate of rewardRates) {
    await trx
      .insertInto('token')
      .values({
        address: rewardRate.rewardToken,
        symbol: rewardRate.token.symbol,
        decimals: rewardRate.token.decimals,
        precision: rewardRate.token.precision,
        network: network.network
      })
      .onConflict((oc) => oc.doNothing())
      .execute()
  }

  // Calculate period timestamps
  const hourTimestamp = Math.floor(currentTimestamp / HOUR_IN_SECONDS) * HOUR_IN_SECONDS
  const dayTimestamp = Math.floor(currentTimestamp / DAY_IN_SECONDS) * DAY_IN_SECONDS
  const offsetTimestamp = currentTimestamp + EPOCH_WEEK_OFFSET
  const weekTimestamp = Math.floor(offsetTimestamp / WEEK_IN_SECONDS) * WEEK_IN_SECONDS - EPOCH_WEEK_OFFSET

  // Calculate total reward rate
  const totalRewardRate = rewardRates
    .reduce((sum, rate) => sum + parseFloat(rate.rate), 0)
    .toString()

  // Store individual reward rates
  for (const rewardRate of rewardRates) {
    const rewardRateId = `${productId}-${currentTimestamp}-${rewardRate.rewardToken}`
    await trx
      .insertInto('rewardRate')
      .values({
        id: rewardRateId,
        rewardToken: rewardRate.rewardToken,
        rate: rewardRate.rate,
        network: network.network,
        productId,
        timestamp: currentTimestamp
      })
      .onConflict((oc) => oc.doNothing())
      .execute()
  }

  // Update hourly average
  await updateHourlyRewardAverage(trx, network, productId, totalRewardRate, hourTimestamp)
  
  // Update daily average
  await updateDailyRewardAverage(trx, network, productId, totalRewardRate, dayTimestamp)
  
  // Update weekly average
  await updateWeeklyRewardAverage(trx, network, productId, totalRewardRate, weekTimestamp)
}

async function updateHourlyRewardAverage(
  trx: Transaction<Database>,
  network: NetworkStatus,
  productId: string,
  newRate: string,
  hourTimestamp: number
) {
  const hourlyRateId = `${network.network}-${productId}-${hourTimestamp}`
  
  // Get or create hourly rate
  const hourlyRate = await trx
    .selectFrom('hourlyRewardRate')
    .where('id', '=', hourlyRateId)
    .selectAll()
    .executeTakeFirst()

  if (!hourlyRate) {
    // Insert new
    await trx
      .insertInto('hourlyRewardRate')
      .values({
        id: hourlyRateId,
        date: hourTimestamp,
        sumRates: newRate,
        updateCount: 1,
        averageRate: newRate,
        protocol: productId.split('-')[0],
        network: network.network,
        productId
      })
      .execute()
  } else {
    // Update existing
    const newSum = (parseFloat(hourlyRate.sumRates) + parseFloat(newRate)).toString()
    const newCount = +(hourlyRate.updateCount + 1)
    const newAverage = (parseFloat(newSum) / newCount).toString()

    await trx
      .updateTable('hourlyRewardRate')
      .set({
        sumRates: newSum,
        updateCount: newCount,
        averageRate: newAverage
      })
      .where('id', '=', hourlyRateId)
      .execute()
  }
}

async function updateDailyRewardAverage(
  trx: Transaction<Database>,
  network: NetworkStatus,
  productId: string,
  newRate: string,
  dayTimestamp: number
) {
  const dailyRateId = `${network.network}-${productId}-${dayTimestamp}`
  
  const dailyRate = await trx
    .selectFrom('dailyRewardRate')
    .where('id', '=', dailyRateId)
    .selectAll()
    .executeTakeFirst()

  if (!dailyRate) {
    await trx
      .insertInto('dailyRewardRate')
      .values({
        id: dailyRateId,
        date: dayTimestamp,
        sumRates: newRate,
        updateCount: 1,
        averageRate: newRate,
        protocol: productId.split('-')[0],
        network: network.network,
        productId
      })
      .execute()
  } else {
    const newSum = (parseFloat(dailyRate.sumRates) + parseFloat(newRate)).toString()
    const newCount = +(dailyRate.updateCount + 1)
    const newAverage = (parseFloat(newSum) / newCount).toString()

    await trx
      .updateTable('dailyRewardRate')
      .set({
        sumRates: newSum,
        updateCount: newCount,
        averageRate: newAverage
      })
      .where('id', '=', dailyRateId)
      .execute()
  }
}

async function updateWeeklyRewardAverage(
  trx: Transaction<Database>,
  network: NetworkStatus,
  productId: string,
  newRate: string,
  weekTimestamp: number
) {
  const weeklyRateId = `${network.network}-${productId}-${weekTimestamp}`
  
  const weeklyRate = await trx
    .selectFrom('weeklyRewardRate')
    .where('id', '=', weeklyRateId)
    .selectAll()
    .executeTakeFirst()

  if (!weeklyRate) {
    await trx
      .insertInto('weeklyRewardRate')
      .values({
        id: weeklyRateId,
        weekTimestamp,
        sumRates: newRate,
        updateCount: 1,
        averageRate: newRate,
        protocol: productId.split('-')[0],
        network: network.network,
        productId
      })
      .execute()
  } else {
    const newSum = (parseFloat(weeklyRate.sumRates) + parseFloat(newRate)).toString()
    const newCount = +(weeklyRate.updateCount + 1)
    const newAverage = (parseFloat(newSum) / newCount).toString()

    await trx
      .updateTable('weeklyRewardRate')
      .set({
        sumRates: newSum,
        updateCount: newCount,
        averageRate: newAverage
      })
      .where('id', '=', weeklyRateId)
      .execute()
  }
}

async function updateInterestRates(
  trx: Transaction<Database>,
  network: NetworkStatus,
  client: SubgraphClient,
  productId: string
) {
  const latestRates = await client.GetLatestInterestRates({
    productId,
    limit: 100,
    fromTimestamp: network.lastUpdatedAt,
    toTimestamp: Math.floor(Date.now() / 1000)
  });

  for (const rate of latestRates.interestRates) {
    // Get matching reward rates for each period
    const hourlyRewardRate = await trx
      .selectFrom('hourlyRewardRate')
      .where('productId', '=', productId)
      .where('date', '=', rate.hourlyRateId.date.toString())
      .selectAll()
      .executeTakeFirst();

    const dailyRewardRate = await trx
      .selectFrom('dailyRewardRate')
      .where('productId', '=', productId)
      .where('date', '=', rate.dailyRateId.date.toString())
      .selectAll()
      .executeTakeFirst();

    const weeklyRewardRate = await trx
      .selectFrom('weeklyRewardRate')
      .where('productId', '=', productId)
      .where('weekTimestamp', '=', rate.weeklyRateId.weekTimestamp.toString())
      .selectAll()
      .executeTakeFirst();

    // Insert/update interest rate
    await trx
      .insertInto('interestRate')
      .values({
        id: rate.id,
        type: rate.type,
        rate: rate.rate + (hourlyRewardRate?.averageRate ? parseFloat(hourlyRewardRate.averageRate) : 0),
        nativeRate: rate.rate,
        rewardsRate: hourlyRewardRate?.averageRate ? hourlyRewardRate.averageRate : '0', // Using hourly as default
        blockNumber: rate.blockNumber,
        timestamp: rate.timestamp,
        protocol: rate.protocol,
        network: network.network,
        token: rate.token.id,
        productId: rate.productId,
        dailyRateId: rate.dailyRateId.id,
        hourlyRateId: rate.hourlyRateId.id,
        weeklyRateId: rate.weeklyRateId.id
      })
      .onConflict((oc) => oc.doNothing())
      .execute();

    // Insert daily rate with combined averages
    const dailyRate = rate.dailyRateId;
    await trx
      .insertInto('dailyInterestRate')
      .values({
        id: dailyRate.id,
        date: dailyRate.date,
        sumRates: dailyRate.sumRates,
        updateCount: dailyRate.updateCount,
        averageRate: (
          parseFloat(dailyRate.averageRate.toString()) + 
          parseFloat(dailyRewardRate?.averageRate || '0')
        ).toString(),
        protocol: dailyRate.protocol,
        token: dailyRate.token,
        productId: dailyRate.productId,
        network: network.network,
        nativeRate: dailyRate.averageRate,
        rewardsRate: dailyRewardRate?.averageRate || '0'
      })
      .onConflict((oc) => oc.doNothing())
      .execute();

    // Similar for hourly and weekly rates...
    const hourlyRate = rate.hourlyRateId;
    await trx
      .insertInto('hourlyInterestRate')
      .values({
        id: hourlyRate.id,
        date: hourlyRate.date,
        sumRates: hourlyRate.sumRates,
        updateCount: hourlyRate.updateCount,
        averageRate: (parseFloat(hourlyRate.averageRate.toString()) + parseFloat(hourlyRewardRate?.averageRate || '0')).toString(),
        protocol: hourlyRate.protocol,
        token: hourlyRate.token,
        productId: hourlyRate.productId,
        network: network.network,
        nativeRate: hourlyRate.averageRate,
        rewardsRate: hourlyRewardRate?.averageRate || '0'
      })
      .onConflict((oc) => oc.doNothing())
      .execute();

    const weeklyRate = rate.weeklyRateId;
    await trx
      .insertInto('weeklyInterestRate')
      .values({
        id: weeklyRate.id,
        weekTimestamp: weeklyRate.weekTimestamp,
        sumRates: weeklyRate.sumRates,
        updateCount: weeklyRate.updateCount,
        averageRate: (parseFloat(weeklyRate.averageRate.toString()) + parseFloat(weeklyRewardRate?.averageRate || '0')).toString(),
        protocol: weeklyRate.protocol,
        token: weeklyRate.token,
        productId: weeklyRate.productId,
        network: network.network,
        nativeRate: weeklyRate.averageRate,
        rewardsRate: weeklyRewardRate?.averageRate || '0'
      })
      .onConflict((oc) => oc.doNothing())
      .execute();
  }

  return latestRates
}

async function ensureTokensExist(
  trx: Transaction<Database>,
  network: NetworkStatus,
  client: SubgraphClient,
  productId: string
) {
  // Get latest rates to extract token info
  const latestRates = await client.GetLatestInterestRates({
    productId,
    limit: 1,
    fromTimestamp: 0,
    toTimestamp: Math.floor(Date.now() / 1000)
  })

  if (latestRates.interestRates.length === 0) return

  const rate = latestRates.interestRates[0]
  
  // Insert token if it doesn't exist
  await trx
    .insertInto('token')
    .values({
      address: rate.token.id,
      symbol: rate.token.symbol,
      decimals: rate.token.decimals,
      precision: rate.token.precision,
      network: network.network
    })
    .onConflict((oc) => oc.doNothing())
    .execute()
}

export const handler = async (
  event: EventBridgeEvent<'Scheduled Event', never>,
  context: Context,
): Promise<void> => {
  logger.addContext(context)

  const { SUBGRAPH_BASE, EARN_PROTOCOL_DB_CONNECTION_STRING, NODE_ENV } = process.env

  if (!NODE_ENV) {
    logger.error('NODE_ENV is not set')
    return
  }

  if (!EARN_PROTOCOL_DB_CONNECTION_STRING) {
    logger.error('EARN_PROTOCOL_DB_CONNECTION_STRING is not set')
    return
  }
  if (!SUBGRAPH_BASE) {
    logger.error('SUBGRAPH_BASE is not set')
    return
  }

  const dbConfig = {
    connectionString: EARN_PROTOCOL_DB_CONNECTION_STRING,
    logger,
  }
  const { db } = await getSummerProtocolDB(dbConfig)

  const clients = getAllClients(SUBGRAPH_BASE)

  await db.transaction().execute(async (trx) => {
    // Get all networks that need updating
    const networks = await trx
      .selectFrom('networkStatus')
      .where('isUpdating', '=', false)
      .where(eb => eb('lastUpdatedAt', '<=', (Math.floor(Date.now() / 1000) - MIN_UPDATE_INTERVAL).toString())
        .or('lastUpdatedAt', 'is', null))
      .selectAll()
      .execute()

    for (const network of networks) {
      try {
        // Try to acquire lock for this network
        const updatedNetwork = await trx
          .updateTable('networkStatus')
          .set({ isUpdating: true })
          .where('network', '=', network.network)
          .where('isUpdating', '=', false)
              .returningAll()
          .executeTakeFirst()

        if (!updatedNetwork) {
          logger.info(`Network ${network.network} is already being updated`)
          continue
        }

        const chainId = networkToChainId[network.network]
        const productIds = supportedProductIds[chainId]

        if (productIds.length === 0) {
          logger.info(`No supported product IDs for network ${network.network}`)
          continue
        }

        logger.info(`Processing network ${network.network} for products: ${productIds.join(', ')}`)
        const client = clients[chainId]

        // Process each product ID
        for (const productId of productIds) {
          try {
            // Ensure tokens exist first
            await db.transaction().execute(trx => 
              ensureTokensExist(trx, network, client, productId)
            )

            // Then process reward and interest rates
            await db.transaction().execute(trx =>
              updateRewardRates(trx, network, productId)
            )

            await db.transaction().execute(trx =>
              updateInterestRates(trx, network, client, productId)
            )
          } catch (error) {
            logger.error(`Error processing product ${productId}`, { error })
            // Continue with next product
          }
        }

        // Update network status after processing all products
        await trx
          .updateTable('networkStatus')
          .set({
            lastUpdatedAt: Math.floor(Date.now() / 1000),
            lastBlockNumber: network.lastBlockNumber, // We might want to track this per product
            isUpdating: false
          })
          .where('network', '=', network.network)
          .execute()

      } catch (error) {
        logger.error(`Error processing network ${network.network}`, { error })

        // Release lock on error within transaction
        await trx
          .updateTable('networkStatus')
          .set({ isUpdating: false })
          .where('network', '=', network.network)
          .execute()

        // Re-throw to trigger transaction rollback
        throw error
      }
    }
  })
}

export default handler
