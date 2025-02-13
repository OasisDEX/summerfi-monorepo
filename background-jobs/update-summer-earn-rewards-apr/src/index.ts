import type { Context, EventBridgeEvent } from 'aws-lambda'
import { Logger } from '@aws-lambda-powertools/logger'
import { getSummerProtocolDB, Network } from '@summerfi/summer-protocol-db'
import process from 'node:process'
import {
  getAllClients,
  SubgraphClient,
  Products,
  Product,
} from '@summerfi/summer-earn-rates-subgraph'

import { RewardsService } from './rewards-service'
import { Transaction } from 'kysely'
import { Database, mapDbNetworkToChainId } from '@summerfi/summer-protocol-db'

const logger = new Logger({ serviceName: 'update-summer-earn-rewards-apr' })

export enum Protocol {
  Morpho = 'Morpho',
  Euler = 'Euler',
}
const supportedProtocols = [Protocol.Morpho, Protocol.Euler]

const rewardsService = new RewardsService(logger)

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
  products: Product[],
  updateStartTimestamp: number,
) {
  const chainId = mapDbNetworkToChainId(network.network)
  const rewardRates = await rewardsService.getRewardRates(products, chainId)

  const currentTimestamp = updateStartTimestamp

  for (const product of products) {
    const productRewardRates = rewardRates[product.id]
    // First ensure all reward tokens exist
    for (const rewardRate of productRewardRates) {
      await trx
        .insertInto('token')
        .values({
          address: rewardRate.rewardToken,
          symbol: rewardRate.token.symbol,
          decimals: rewardRate.token.decimals,
          precision: rewardRate.token.precision.toString(),
          network: network.network,
        })
        .onConflict((oc) => oc.doNothing())
        .execute()
    }

    // Calculate period timestamps
    const hourTimestamp = Math.floor(currentTimestamp / HOUR_IN_SECONDS) * HOUR_IN_SECONDS
    const dayTimestamp = Math.floor(currentTimestamp / DAY_IN_SECONDS) * DAY_IN_SECONDS
    const offsetTimestamp = currentTimestamp + EPOCH_WEEK_OFFSET
    const weekTimestamp =
      Math.floor(offsetTimestamp / WEEK_IN_SECONDS) * WEEK_IN_SECONDS - EPOCH_WEEK_OFFSET

    // Calculate total reward rate
    const totalRewardRate = productRewardRates
      .reduce((sum, rate) => sum + parseFloat(rate.rate), 0)
      .toString()

    // Store individual reward rates
    for (const rewardRate of productRewardRates) {
      const rewardRateId = `${product.id}-${currentTimestamp}-${rewardRate.rewardToken}`
      await trx
        .insertInto('rewardRate')
        .values({
          id: rewardRateId,
          rewardToken: rewardRate.rewardToken,
          rate: rewardRate.rate,
          network: network.network,
          productId: product.id,
          timestamp: currentTimestamp,
        })
        .onConflict((oc) => oc.doNothing())
        .execute()
    }

    // Update hourly average
    await updateHourlyRewardAverage(trx, network, product, totalRewardRate, hourTimestamp)

    // Update daily average
    await updateDailyRewardAverage(trx, network, product, totalRewardRate, dayTimestamp)

    // Update weekly average
    await updateWeeklyRewardAverage(trx, network, product, totalRewardRate, weekTimestamp)
  }
}

async function updateHourlyRewardAverage(
  trx: Transaction<Database>,
  network: NetworkStatus,
  product: Product,
  newRate: string,
  hourTimestamp: number,
) {
  const hourlyRateId = `${network.network}-${product.id}-${hourTimestamp}`

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
        protocol: product.protocol,
        network: network.network,
        productId: product.id,
      })
      .execute()
  } else {
    // Update existing
    const newSum = (parseFloat(hourlyRate.sumRates) + parseFloat(newRate)).toString()
    const newCount = +hourlyRate.updateCount + 1
    const newAverage = (parseFloat(newSum) / newCount).toString()

    await trx
      .updateTable('hourlyRewardRate')
      .set({
        sumRates: newSum,
        updateCount: newCount,
        averageRate: newAverage,
      })
      .where('id', '=', hourlyRateId)
      .execute()
  }
}

async function updateDailyRewardAverage(
  trx: Transaction<Database>,
  network: NetworkStatus,
  product: Product,
  newRate: string,
  dayTimestamp: number,
) {
  const dailyRateId = `${network.network}-${product.id}-${dayTimestamp}`

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
        protocol: product.protocol,
        network: network.network,
        productId: product.id,
      })
      .execute()
  } else {
    const newSum = (parseFloat(dailyRate.sumRates) + parseFloat(newRate)).toString()
    const newCount = +dailyRate.updateCount + 1
    const newAverage = (parseFloat(newSum) / newCount).toString()

    await trx
      .updateTable('dailyRewardRate')
      .set({
        sumRates: newSum,
        updateCount: newCount,
        averageRate: newAverage,
      })
      .where('id', '=', dailyRateId)
      .execute()
  }
}

async function updateWeeklyRewardAverage(
  trx: Transaction<Database>,
  network: NetworkStatus,
  product: Product,
  newRate: string,
  weekTimestamp: number,
) {
  const weeklyRateId = `${network.network}-${product.id}-${weekTimestamp}`

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
        protocol: product.protocol,
        network: network.network,
        productId: product.id,
      })
      .execute()
  } else {
    const newSum = (parseFloat(weeklyRate.sumRates) + parseFloat(newRate)).toString()
    const newCount = +weeklyRate.updateCount + 1
    const newAverage = (parseFloat(newSum) / newCount).toString()

    await trx
      .updateTable('weeklyRewardRate')
      .set({
        sumRates: newSum,
        updateCount: newCount,
        averageRate: newAverage,
      })
      .where('id', '=', weeklyRateId)
      .execute()
  }
}

async function getSupportedProducts(client: SubgraphClient): Promise<Products> {
  let products: Products = []
  try {
    const response = await client.GetProducts({ protocols: supportedProtocols })

    products = response.products
  } catch (error) {
    logger.error('Error fetching products:', error instanceof Error ? error : String(error))
  }

  return products
}

export const handler = async (
  _: EventBridgeEvent<'Scheduled Event', never>,
  context: Context,
): Promise<void> => {
  logger.addContext(context)
  logger.debug('Handler started')

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
  // rounded to full minutes
  const updateStartTimestamp = Math.floor(Date.now() / 1000 / 60) * 60

  // Get all potential networks
  const allNetworks = await db.selectFrom('networkStatus').selectAll().execute()

  logger.debug('Starting network processing', { networkCount: allNetworks.length })

  for (const network of allNetworks) {
    logger.debug('Processing network', { network: network.network })
    try {
      // Start transaction that includes both lock acquisition and processing
      await db.transaction().execute(async (trx) => {
        // Attempt to acquire lock within transaction
        const updatedNetwork = await trx
          .updateTable('networkStatus')
          .set({ isUpdating: true })
          .where('network', '=', network.network)
          .where('isUpdating', '=', false)
          .where((eb) =>
            eb('lastUpdatedAt', '<=', (updateStartTimestamp - MIN_UPDATE_INTERVAL).toString()).or(
              'lastUpdatedAt',
              'is',
              null,
            ),
          )
          .returningAll()
          .executeTakeFirst()

        if (!updatedNetwork) {
          logger.debug('Skipping network - lock not acquired or too soon to update', {
            network: network.network,
            lastUpdate: network.lastUpdatedAt,
          })
          return
        }

        logger.debug('Lock acquired for network', {
          network: updatedNetwork.network,
          chainId: mapDbNetworkToChainId(updatedNetwork.network),
          timestamp: updateStartTimestamp,
        })

        // Main processing
        const chainId = mapDbNetworkToChainId(updatedNetwork.network)
        const subgraphClient = clients[chainId]
        const products = await getSupportedProducts(subgraphClient)
        logger.debug('Retrieved products', {
          network: updatedNetwork.network,
          productCount: products.length,
        })

        if (products.length > 0) {
          // Token updates
          await trx
            .insertInto('token')
            .values(
              products.map((product) => ({
                address: product.token.id,
                symbol: product.token.symbol,
                decimals: +product.token.decimals,
                precision: product.token.precision.toString(),
                network: updatedNetwork.network,
              })),
            )
            .onConflict((oc) => oc.doNothing())
            .execute()

          await updateRewardRates(trx, updatedNetwork, products, updateStartTimestamp)
          logger.debug('Updated reward rates', {
            network: updatedNetwork.network,
            timestamp: updateStartTimestamp,
          })
        } else {
          logger.debug('No products found for network', {
            network: updatedNetwork.network,
          })
        }

        // Final update including lock release
        await trx
          .updateTable('networkStatus')
          .set({
            lastUpdatedAt: updateStartTimestamp,
            lastBlockNumber: updatedNetwork.lastBlockNumber,
            isUpdating: false,
          })
          .where('network', '=', updatedNetwork.network)
          .execute()

        logger.debug('Network processing completed successfully', {
          network: updatedNetwork.network,
        })
      })
    } catch (error) {
      logger.error(`Error processing network ${network.network}`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        network: network.network,
        timestamp: updateStartTimestamp,
      })
    }
  }

  logger.debug('Handler completed')
}

export default handler
