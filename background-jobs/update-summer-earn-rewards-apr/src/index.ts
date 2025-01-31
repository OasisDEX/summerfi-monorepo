import type { Context, EventBridgeEvent } from 'aws-lambda'
import { Logger } from '@aws-lambda-powertools/logger'
import { getSummerProtocolDB, Network } from '@summerfi/summer-protocol-db'
import process from 'node:process'
import {
  getAllClients,
  SubgraphClient,
  Products,
  Product
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
export enum Protocol {
  Morpho = 'Morpho',
  Euler = 'Euler'
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

// type Token = {
//   address: string
//   symbol: string
//   decimals: number
//   precision: number
// }

async function updateRewardRates(
  trx: Transaction<Database>,
  network: NetworkStatus,
  products: Product[],
  updateStartTimestamp: number
) {
  const rewardRates = await rewardsService.getRewardRates(products, networkToChainId[network.network])

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
          timestamp: currentTimestamp
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
  hourTimestamp: number
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
        productId: product.id
      })
      .execute()
  } else {
    // Update existing
    const newSum = (parseFloat(hourlyRate.sumRates) + parseFloat(newRate)).toString()
    const newCount = (+hourlyRate.updateCount + 1)
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
  product: Product,
  newRate: string,
  dayTimestamp: number
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
        productId: product.id
      })
      .execute()
  } else {
    const newSum = (parseFloat(dailyRate.sumRates) + parseFloat(newRate)).toString()
    const newCount = (+dailyRate.updateCount + 1)
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
  product: Product,
  newRate: string,
  weekTimestamp: number
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
        productId: product.id
      })
      .execute()
  } else {
    const newSum = (parseFloat(weeklyRate.sumRates) + parseFloat(newRate)).toString()
    const newCount = (+weeklyRate.updateCount + 1)
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

async function ensureTokensExist(
  trx: Transaction<Database>,
  network: NetworkStatus,
  products: Product[]
) {
  // Insert token if it doesn't exist
  for (const product of products) {
    await trx
      .insertInto('token')
      .values({
        address: product.token.id,
        symbol: product.token.symbol,
        decimals: +product.token.decimals,
        precision: product.token.precision.toString(),
        network: network.network
      })
      .onConflict((oc) => oc.doNothing())
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
      const updateStartTimestamp = Math.floor(Date.now() / 1000)
      
      try {
        // Acquire lock by setting isUpdating to true
        await trx
          .updateTable('networkStatus')
          .set({ isUpdating: true })
          .where('network', '=', network.network)
          .execute()

        const chainId = networkToChainId[network.network]
        const subgraphClient = clients[chainId]
        const products = await getSupportedProducts(subgraphClient)

        // Token updates in SEPARATE transaction
        await db.transaction().execute(async (tokenTrx) => {
          await ensureTokensExist(tokenTrx, network, products)
        })

        // Rates updates in MAIN transaction, passing the start timestamp
        await updateRewardRates(trx, network, products, updateStartTimestamp)

        // Update network status only if everything succeeded
        await trx
          .updateTable('networkStatus')
          .set({
            lastUpdatedAt: updateStartTimestamp,
            lastBlockNumber: network.lastBlockNumber,
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
