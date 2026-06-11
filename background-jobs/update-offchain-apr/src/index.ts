import type { Context, EventBridgeEvent } from 'aws-lambda'
import { Logger } from '@aws-lambda-powertools/logger'
import { Transaction } from 'kysely'
import process from 'node:process'
import {
  getAllClients as getAllRatesSubgraphClients,
  SubgraphClient as RatesSubgraphClient,
  Product,
  GetProductsQuery,
} from '@summerfi/summer-earn-rates-subgraph'
import {
  Database,
  getSummerProtocolDB,
  mapDbNetworkToChainId,
  Network,
  NetworkStatus,
} from '@summerfi/summer-protocol-db'

import { AprService } from './apr-service'
import { OffchainAprRate } from './apr-fetchers/IAprFetcher'

const logger = new Logger({ serviceName: 'update-offchain-apr', logLevel: 'DEBUG' })

export const HOUR_IN_SECONDS = 3600
export const DAY_IN_SECONDS = 86400
export const WEEK_IN_SECONDS = 604800
export const EPOCH_WEEK_OFFSET = 345600 // 4 days, matches the rewards job

/**
 * Networks the job considers. Mirrors the rewards job's filter.
 */
const SUPPORTED_NETWORKS: Network[] = ['mainnet', 'arbitrum', 'base', 'sonic', 'hyperliquid']

async function getProductsForProtocols(
  client: RatesSubgraphClient,
  protocols: string[],
  network: Network,
): Promise<Product[]> {
  try {
    const results = await client.GetProducts({ protocols })
    return results.products
  } catch (error) {
    logger.error('[update-offchain-apr] Failed to fetch products', {
      network,
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}

/**
 * Persists a single base-APR sample and folds it into the hourly/daily/weekly
 * rollups, mirroring the reward-rate aggregation in the rewards job.
 *
 * Sample inserts are idempotent (deterministic id + onConflict doNothing) so a
 * re-run for the same minute is a no-op. The rollups are read-modify-write and
 * therefore assume this cron does not overlap itself; if that ever changes,
 * introduce a dedicated lock row rather than reusing the rewards job's
 * `networkStatus.isUpdating`.
 */
async function persistOffchainApr(
  trx: Transaction<Database>,
  network: Network,
  productId: string,
  protocol: string,
  observation: OffchainAprRate,
  timestamp: number,
): Promise<void> {
  await trx
    .insertInto('offchainApr')
    .values({
      id: `${network}-${productId}-${timestamp}`,
      productId,
      protocol,
      rate: observation.rate,
      source: observation.source,
      asOf: observation.asOf,
      network,
      timestamp,
    })
    .onConflict((oc) => oc.doNothing())
    .execute()

  const hourTimestamp = Math.floor(timestamp / HOUR_IN_SECONDS) * HOUR_IN_SECONDS
  const dayTimestamp = Math.floor(timestamp / DAY_IN_SECONDS) * DAY_IN_SECONDS
  const offsetTimestamp = timestamp + EPOCH_WEEK_OFFSET
  const weekTimestamp =
    Math.floor(offsetTimestamp / WEEK_IN_SECONDS) * WEEK_IN_SECONDS - EPOCH_WEEK_OFFSET

  await updateHourlyOffchainApr(trx, network, productId, protocol, observation.rate, hourTimestamp)
  await updateDailyOffchainApr(trx, network, productId, protocol, observation.rate, dayTimestamp)
  await updateWeeklyOffchainApr(trx, network, productId, protocol, observation.rate, weekTimestamp)
}

async function updateHourlyOffchainApr(
  trx: Transaction<Database>,
  network: Network,
  productId: string,
  protocol: string,
  newRate: string,
  date: number,
): Promise<void> {
  const id = `${network}-${productId}-${date}`
  const existing = await trx
    .selectFrom('hourlyOffchainApr')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst()

  if (!existing) {
    await trx
      .insertInto('hourlyOffchainApr')
      .values({
        id,
        date,
        sumRates: newRate,
        updateCount: '1',
        averageRate: newRate,
        protocol,
        network,
        productId,
      })
      .execute()
    return
  }

  const newCount = (BigInt(existing.updateCount) + 1n).toString()
  const newSum = (Number(existing.sumRates) + Number(newRate)).toString()
  const newAverage = (Number(newSum) / Number(newCount)).toString()
  await trx
    .updateTable('hourlyOffchainApr')
    .set({ sumRates: newSum, updateCount: newCount, averageRate: newAverage })
    .where('id', '=', id)
    .execute()
}

async function updateDailyOffchainApr(
  trx: Transaction<Database>,
  network: Network,
  productId: string,
  protocol: string,
  newRate: string,
  date: number,
): Promise<void> {
  const id = `${network}-${productId}-${date}`
  const existing = await trx
    .selectFrom('dailyOffchainApr')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst()

  if (!existing) {
    await trx
      .insertInto('dailyOffchainApr')
      .values({
        id,
        date,
        sumRates: newRate,
        updateCount: '1',
        averageRate: newRate,
        protocol,
        network,
        productId,
      })
      .execute()
    return
  }

  const newCount = (BigInt(existing.updateCount) + 1n).toString()
  const newSum = (Number(existing.sumRates) + Number(newRate)).toString()
  const newAverage = (Number(newSum) / Number(newCount)).toString()
  await trx
    .updateTable('dailyOffchainApr')
    .set({ sumRates: newSum, updateCount: newCount, averageRate: newAverage })
    .where('id', '=', id)
    .execute()
}

async function updateWeeklyOffchainApr(
  trx: Transaction<Database>,
  network: Network,
  productId: string,
  protocol: string,
  newRate: string,
  weekTimestamp: number,
): Promise<void> {
  const id = `${network}-${productId}-${weekTimestamp}`
  const existing = await trx
    .selectFrom('weeklyOffchainApr')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst()

  if (!existing) {
    await trx
      .insertInto('weeklyOffchainApr')
      .values({
        id,
        weekTimestamp,
        sumRates: newRate,
        updateCount: '1',
        averageRate: newRate,
        protocol,
        network,
        productId,
      })
      .execute()
    return
  }

  const newCount = (BigInt(existing.updateCount) + 1n).toString()
  const newSum = (Number(existing.sumRates) + Number(newRate)).toString()
  const newAverage = (Number(newSum) / Number(newCount)).toString()
  await trx
    .updateTable('weeklyOffchainApr')
    .set({ sumRates: newSum, updateCount: newCount, averageRate: newAverage })
    .where('id', '=', id)
    .execute()
}

export const handler = async (
  _: EventBridgeEvent<'Scheduled Event', never>,
  context: Context,
): Promise<void> => {
  logger.addContext(context)
  logger.debug('[update-offchain-apr] Handler started')

  const { SUBGRAPH_BASE, EARN_PROTOCOL_DB_CONNECTION_STRING } = process.env

  if (!EARN_PROTOCOL_DB_CONNECTION_STRING) {
    logger.error('EARN_PROTOCOL_DB_CONNECTION_STRING is not set')
    return
  }
  if (!SUBGRAPH_BASE) {
    logger.error('SUBGRAPH_BASE is not set')
    return
  }

  const aprService = new AprService(logger)
  if (aprService.protocols.length === 0) {
    logger.info(
      '[update-offchain-apr] No offchain APR fetchers registered; nothing to do. ' +
        'Register an adapter in apr-service.ts to enable.',
    )
    return
  }

  const { db } = await getSummerProtocolDB({ connectionString: EARN_PROTOCOL_DB_CONNECTION_STRING })

  try {
    const ratesSubgraphClients = getAllRatesSubgraphClients(SUBGRAPH_BASE)

    // rounded to full minutes, matching the rewards job
    const updateStartTimestamp = Math.floor(Date.now() / 1000 / 60) * 60

    const allNetworks = (await db.selectFrom('networkStatus').selectAll().execute()).filter(
      (network) => SUPPORTED_NETWORKS.includes(network.network),
    )

    for (const network of allNetworks) {
      logger.debug('[update-offchain-apr] Processing network', { network: network.network })
      try {
        const chainId = mapDbNetworkToChainId(network.network)
        const ratesSubgraphClient = ratesSubgraphClients[chainId]
        if (!ratesSubgraphClient) {
          logger.warn('[update-offchain-apr] No rates subgraph client for network', {
            network: network.network,
          })
          continue
        }

        const products = await getProductsForProtocols(
          ratesSubgraphClient,
          aprService.protocols,
          network.network,
        )
        if (products.length === 0) {
          continue
        }

        const aprRates = await aprService.getAprRates(products, chainId)
        const resolvedCount = Object.keys(aprRates).length
        logger.debug('[update-offchain-apr] Resolved offchain APRs', {
          network: network.network,
          productCount: products.length,
          resolvedCount,
        })
        if (resolvedCount === 0) {
          continue
        }

        const productsById = new Map(products.map((p) => [p.id, p]))

        await db.transaction().execute(async (trx) => {
          for (const [productId, observation] of Object.entries(aprRates)) {
            const product = productsById.get(productId)
            if (!product) {
              continue
            }
            await persistOffchainApr(
              trx,
              network.network,
              productId,
              product.protocol,
              observation,
              updateStartTimestamp,
            )
          }
        })
      } catch (error) {
        logger.error('[update-offchain-apr] Error processing network', {
          network: network.network,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        })
      }
    }
  } finally {
    await db.destroy()
  }
}

// Keep the type exported for downstream consumers/tests.
export type { NetworkStatus, GetProductsQuery }
