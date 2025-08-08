import { Logger } from '@aws-lambda-powertools/logger'
import {
  getSummerProtocolDB,
  mapDbNetworkToChainId,
  type Database,
  type Network,
} from '@summerfi/summer-protocol-db'
import {
  getAllClients as getAllRatesSubgraphClients,
  type GetHistoricalArksRatesQuery,
  type Product,
  type SubgraphClient as RatesSubgraphClient,
  GetProductsQuery,
} from '@summerfi/summer-earn-rates-subgraph'
import {
  getAllClients as getAllProtocolSubgraphClients,
  type SubgraphClient as ProtocolSubgraphClient,
  type HistoricalVaultsQuery,
  type VaultsQuery,
} from '@summerfi/summer-earn-protocol-subgraph'
import { Transaction } from 'kysely'
import dotenv from 'dotenv'
dotenv.config()

// Standalone constants and helpers (avoid importing from index to prevent ESM cycles)
export const HOUR_IN_SECONDS = 3600
export const DAY_IN_SECONDS = 86400
export const WEEK_IN_SECONDS = 604800
export const EPOCH_WEEK_OFFSET = 345600 // 4 days

export interface NetworkStatus {
  network: Network
  isUpdating: boolean
  lastUpdatedAt: string
  lastBlockNumber: string
}

export async function retrySubgraphQuery<TResponse>(
  operation: () => Promise<TResponse>,
  options: {
    retries?: number
    initialDelay?: number
    logger: Logger
    context: {
      operation: string
      network?: Network
      [key: string]: string | number | string[] | Network | undefined
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
      delay *= 2
    }
  }
  throw new Error(`Failed to complete ${context.operation} after all retries`)
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
      .set({ sumRates: newSum, updateCount: newCount, averageRate: newAverage })
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
      .set({ sumRates: newSum, updateCount: newCount, averageRate: newAverage })
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
      .set({ sumRates: newSum, updateCount: newCount, averageRate: newAverage })
      .where('id', '=', weeklyRateId)
      .execute()
  }
}

const logger = new Logger({ serviceName: 'standalone-backfill' })

interface CliArgs {
  network: Network
  fleet: string
  start: number
  end?: number
  interval?: number
}

function parseArgs(argv: string[]): CliArgs {
  const args: Record<string, string> = {}
  for (let i = 2; i < argv.length; i++) {
    const part = argv[i]
    if (part.startsWith('--')) {
      const key = part.slice(2)
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for argument ${part}`)
      }
      args[key] = value
      i++
    }
  }

  const network = (args.network as Network) || (args.chain as Network)
  const fleet = args.fleet || args.vault || args.address
  const start = args.start ? Number(args.start) : NaN
  const end = args.end ? Number(args.end) : undefined
  const interval = args.interval ? Number(args.interval) : 600

  if (!network || !fleet || !Number.isFinite(start)) {
    throw new Error(
      'Usage: ts-node src/scripts/standalone-backfill.ts --network <mainnet|arbitrum|base|sonic> --fleet <address> --start <timestampSec> [--end <timestampSec>] [--interval <seconds>]',
    )
  }

  return { network, fleet: fleet.toLowerCase(), start, end, interval }
}

function computePeriodTimestamps(timestamp: number) {
  const hourTimestamp = Math.floor(timestamp / HOUR_IN_SECONDS) * HOUR_IN_SECONDS
  const dayTimestamp = Math.floor(timestamp / DAY_IN_SECONDS) * DAY_IN_SECONDS
  const offsetTimestamp = timestamp + EPOCH_WEEK_OFFSET
  const weekTimestamp =
    Math.floor(offsetTimestamp / WEEK_IN_SECONDS) * WEEK_IN_SECONDS - EPOCH_WEEK_OFFSET
  return { hourTimestamp, dayTimestamp, weekTimestamp }
}

function computeWeekStart(timestamp: number): number {
  return computePeriodTimestamps(timestamp).weekTimestamp
}

async function getVaultAndProducts(
  protocolClient: ProtocolSubgraphClient,
  ratesClient: RatesSubgraphClient,
  network: Network,
  fleetAddress: string,
) {
  const vaults = await retrySubgraphQuery<VaultsQuery>(() => protocolClient.Vaults(), {
    logger,
    context: { operation: 'GetVaults', network },
  })
  const vault = vaults.vaults.find((v) => v.id.toLowerCase() === fleetAddress)
  if (!vault) {
    throw new Error(`Vault ${fleetAddress} not found on ${network}`)
  }

  // Fetch supported products to enrich with protocol info
  const productsResp = await retrySubgraphQuery<GetProductsQuery>(
    () =>
      ratesClient.GetProducts({
        protocols: ['Morpho', 'Euler', 'AaveV3', 'Gearbox', 'Moonwell', 'Silo'],
      }),
    { logger, context: { operation: 'GetProducts', network } },
  )
  const productMap = new Map(productsResp.products.map((p) => [p.id, p]))
  const arks = vault.arks
  const productIds = arks.map((ark) => ark.productId)
  const products: Product[] = productIds
    .map((id) => productMap.get(id))
    .filter((p): p is Product => Boolean(p))

  return { vault, products, productIds }
}

async function deleteAggregates(
  trx: Transaction<Database>,
  network: Network,
  fleetAddress: string,
  productIds: string[],
  deletionStartTimestamp: number,
) {
  // Reward aggregates (keep base rewardRate)
  await trx
    .deleteFrom('hourlyRewardRate')
    .where('network', '=', network)
    .where('productId', 'in', productIds)
    .where('date', '>=', deletionStartTimestamp.toString())
    .execute()

  await trx
    .deleteFrom('dailyRewardRate')
    .where('network', '=', network)
    .where('productId', 'in', productIds)
    .where('date', '>=', deletionStartTimestamp.toString())
    .execute()

  await trx
    .deleteFrom('weeklyRewardRate')
    .where('network', '=', network)
    .where('productId', 'in', productIds)
    .where('weekTimestamp', '>=', deletionStartTimestamp.toString())
    .execute()

  // Fleet aggregates and base fleetInterestRate
  await trx
    .deleteFrom('hourlyFleetInterestRate')
    .where('network', '=', network)
    .where('fleetAddress', '=', fleetAddress)
    .where('date', '>=', deletionStartTimestamp.toString())
    .execute()

  await trx
    .deleteFrom('dailyFleetInterestRate')
    .where('network', '=', network)
    .where('fleetAddress', '=', fleetAddress)
    .where('date', '>=', deletionStartTimestamp.toString())
    .execute()

  await trx
    .deleteFrom('weeklyFleetInterestRate')
    .where('network', '=', network)
    .where('fleetAddress', '=', fleetAddress)
    .where('weekTimestamp', '>=', deletionStartTimestamp.toString())
    .execute()

  await trx
    .deleteFrom('fleetInterestRate')
    .where('network', '=', network)
    .where('fleetAddress', '=', fleetAddress)
    .where('timestamp', '>=', deletionStartTimestamp.toString())
    .execute()
}

function buildBlockTimestampIndex(historicalRates: GetHistoricalArksRatesQuery): Array<{
  blockNumber: number
  timestamp: number
}> {
  const pairs: Array<{ blockNumber: number; timestamp: number }> = []
  for (const product of historicalRates.products) {
    for (const rate of product.interestRates) {
      pairs.push({ blockNumber: +rate.blockNumber, timestamp: +rate.timestamp })
    }
  }
  // Sort ascending by timestamp and de-duplicate by blockNumber keeping latest timestamp if repeated
  pairs.sort((a, b) => a.timestamp - b.timestamp)
  const uniqueByBlock = new Map<number, number>()
  for (const p of pairs) {
    uniqueByBlock.set(p.blockNumber, p.timestamp)
  }
  return [...uniqueByBlock.entries()].map(([blockNumber, timestamp]) => ({
    blockNumber,
    timestamp,
  }))
}

function findClosestBlock(
  blockIndex: Array<{ blockNumber: number; timestamp: number }>,
  t: number,
) {
  let lo = 0
  let hi = blockIndex.length - 1
  let ans: { blockNumber: number; timestamp: number } | undefined
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    const cur = blockIndex[mid]
    if (cur.timestamp <= t) {
      ans = cur
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return ans
}

function buildProductRateAccessors(historicalRates: GetHistoricalArksRatesQuery) {
  const productIdToRates = new Map(
    historicalRates.products.map((p) => [
      p.id,
      [...p.interestRates].sort((a, b) => +a.timestamp - +b.timestamp),
    ]),
  )
  return function getBaseRateAtOrBefore(productId: string, t: number): number {
    const list = productIdToRates.get(productId)
    if (!list || list.length === 0) return 0
    // binary search rightmost <= t
    let lo = 0
    let hi = list.length - 1
    let idx = -1
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2)
      const ts = +list[mid].timestamp
      if (ts <= t) {
        idx = mid
        lo = mid + 1
      } else {
        hi = mid - 1
      }
    }
    if (idx === -1) return 0
    return +list[idx].rate
  }
}

async function getRewardTotalsAt(
  trx: Transaction<Database>,
  network: Network,
  productIds: string[],
  t: number,
): Promise<Record<string, number>> {
  // Find the latest rewardRate timestamp per product at or before t, then sum per product
  const latest = await trx
    .with('latest_timestamps', (qb) =>
      qb
        .selectFrom('rewardRate')
        .select(['productId', 'network'])
        .select((eb) => eb.fn.max('timestamp').as('maxTimestamp'))
        .where('network', '=', network)
        .where('timestamp', '<=', t.toString())
        .where('productId', 'in', productIds)
        .groupBy(['productId', 'network']),
    )
    .selectFrom('rewardRate')
    .innerJoin('latest_timestamps', (join) =>
      join
        .onRef('rewardRate.productId', '=', 'latest_timestamps.productId')
        .onRef('rewardRate.network', '=', 'latest_timestamps.network')
        .onRef('rewardRate.timestamp', '=', 'latest_timestamps.maxTimestamp'),
    )
    .select(['rewardRate.productId', (eb) => eb.fn.sum('rewardRate.rate').as('total')])
    .groupBy(['rewardRate.productId'])
    .execute()

  type SumRow = { productId: string; total: string | number | bigint }
  const rows = latest as unknown as SumRow[]
  return Object.fromEntries(
    rows.map((r) => [
      r.productId,
      typeof r.total === 'string' ? parseFloat(r.total) : Number(r.total),
    ]),
  )
}

async function updateRewardAggregates(
  trx: Transaction<Database>,
  network: NetworkStatus,
  products: Product[],
  rewardTotals: Record<string, number>,
  timestamp: number,
) {
  const { hourTimestamp, dayTimestamp, weekTimestamp } = computePeriodTimestamps(timestamp)
  for (const product of products) {
    const totalRewardRate = rewardTotals[product.id] ?? 0
    if (totalRewardRate === 0) continue

    const hourlyRateId = `${network.network}-${product.id}-${hourTimestamp}`
    const hourlyRate = await trx
      .selectFrom('hourlyRewardRate')
      .where('id', '=', hourlyRateId)
      .selectAll()
      .executeTakeFirst()
    if (!hourlyRate) {
      await trx
        .insertInto('hourlyRewardRate')
        .values({
          id: hourlyRateId,
          date: hourTimestamp,
          sumRates: totalRewardRate.toString(),
          updateCount: 1,
          averageRate: totalRewardRate.toString(),
          protocol: product.protocol,
          network: network.network,
          productId: product.id,
        })
        .execute()
    } else {
      const newSum = (parseFloat(hourlyRate.sumRates) + totalRewardRate).toString()
      const newCount = +hourlyRate.updateCount + 1
      const newAverage = (parseFloat(newSum) / newCount).toString()
      await trx
        .updateTable('hourlyRewardRate')
        .set({ sumRates: newSum, updateCount: newCount, averageRate: newAverage })
        .where('id', '=', hourlyRateId)
        .execute()
    }

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
          sumRates: totalRewardRate.toString(),
          updateCount: 1,
          averageRate: totalRewardRate.toString(),
          protocol: product.protocol,
          network: network.network,
          productId: product.id,
        })
        .execute()
    } else {
      const newSum = (parseFloat(dailyRate.sumRates) + totalRewardRate).toString()
      const newCount = +dailyRate.updateCount + 1
      const newAverage = (parseFloat(newSum) / newCount).toString()
      await trx
        .updateTable('dailyRewardRate')
        .set({ sumRates: newSum, updateCount: newCount, averageRate: newAverage })
        .where('id', '=', dailyRateId)
        .execute()
    }

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
          sumRates: totalRewardRate.toString(),
          updateCount: 1,
          averageRate: totalRewardRate.toString(),
          protocol: product.protocol,
          network: network.network,
          productId: product.id,
        })
        .execute()
    } else {
      const newSum = (parseFloat(weeklyRate.sumRates) + totalRewardRate).toString()
      const newCount = +weeklyRate.updateCount + 1
      const newAverage = (parseFloat(newSum) / newCount).toString()
      await trx
        .updateTable('weeklyRewardRate')
        .set({ sumRates: newSum, updateCount: newCount, averageRate: newAverage })
        .where('id', '=', weeklyRateId)
        .execute()
    }
  }
}

async function run() {
  const { SUBGRAPH_BASE, EARN_PROTOCOL_DB_CONNECTION_STRING } = process.env
  if (!SUBGRAPH_BASE || !EARN_PROTOCOL_DB_CONNECTION_STRING) {
    throw new Error('Missing SUBGRAPH_BASE or EARN_PROTOCOL_DB_CONNECTION_STRING env variable')
  }

  const { network, fleet, start, end, interval } = parseArgs(process.argv)
  const endTs = end ?? Math.floor(Date.now() / 1000)
  const deletionStart = computeWeekStart(start)

  const { db } = await getSummerProtocolDB({ connectionString: EARN_PROTOCOL_DB_CONNECTION_STRING })
  try {
    const ratesClients = getAllRatesSubgraphClients(SUBGRAPH_BASE)
    const protocolClients = getAllProtocolSubgraphClients(SUBGRAPH_BASE)
    const chainId = mapDbNetworkToChainId(network)
    const ratesClient = ratesClients[chainId]
    const protocolClient = protocolClients[chainId]

    // Load vault and product context
    const networkStatus: NetworkStatus = {
      network,
      isUpdating: false,
      lastUpdatedAt: '0',
      lastBlockNumber: '0',
    }
    const { products, productIds, vault } = await getVaultAndProducts(
      protocolClient,
      ratesClient,
      network,
      fleet,
    )

    // Delete aggregates from deletionStart
    await db.transaction().execute(async (trx) => {
      await deleteAggregates(trx, network, fleet, productIds, deletionStart)
    })

    // Cursor-based pagination for historical base rates
    let lastID = ''
    const productsRates: GetHistoricalArksRatesQuery['products'] = productIds.map((id) => ({
      id,
      interestRates: [] as any,
    }))
    let pageCount = 0
    const maxPages = 50 // Safety limit to prevent infinite loops
    const startTime = Date.now()
    const maxTimeMs = 5 * 60 * 1000 // 5 minutes timeout

    while (pageCount < maxPages) {
      pageCount++

      // Check timeout
      if (Date.now() - startTime > maxTimeMs) {
        console.log(`Timeout reached after ${maxTimeMs / 1000} seconds, stopping pagination`)
        break
      }

      console.log(`Getting historical rates page ${pageCount} for`, {
        productIds,
        timestamp: deletionStart,
        first: 1000,
        lastID,
      })

      const page = await retrySubgraphQuery<GetHistoricalArksRatesQuery>(
        () =>
          ratesClient.GetHistoricalArksRates({
            productIds,
            timestamp: deletionStart,
            first: 1000,
            lastID,
          }),
        {
          logger,
          context: {
            operation: 'GetHistoricalArksRates(page)',
            network,
            startTimestamp: deletionStart,
            lastID,
            pageCount,
          },
        },
      )

      let returned = 0
      let maxId = lastID
      let hasNewData = false

      for (const p of page.products) {
        const target = productsRates.find((x) => x.id === p.id)!
        if (p.interestRates && p.interestRates.length > 0) {
          ;(target.interestRates as any).push(...p.interestRates)
          returned += p.interestRates.length
          hasNewData = true

          for (const r of p.interestRates) {
            if (r.id && r.id > maxId) {
              maxId = r.id
            }
            // Debug specific ID that's causing issues
            if (
              r.id &&
              r.id.includes(
                'AaveV3-0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42-0xa238dd80c259a72e81d7e4664a9801593f98d1c5-8453',
              )
            ) {
              console.log('Found problematic ID:', r.id, 'in product:', p.id)
            }
          }
        }
      }

      console.log(
        `Page ${pageCount} returned ${returned} items, maxId: ${maxId}, lastID: ${lastID}`,
      )

      // Break conditions
      if (returned === 0) {
        console.log('No more data returned, breaking')
        break
      }
      if (returned < 1000) {
        console.log('Less than 1000 items returned, breaking')
        break
      }
      if (maxId === lastID && !hasNewData) {
        console.log('No new data and maxId unchanged, breaking')
        break
      }
      if (maxId === lastID) {
        console.log('Warning: maxId unchanged but has new data, continuing...')
      }

      lastID = maxId
    }

    if (pageCount >= maxPages) {
      console.log(`Warning: Reached maximum page limit (${maxPages}), stopping pagination`)
    }

    // Log summary of collected data
    const totalRates = productsRates.reduce((sum, p) => sum + (p.interestRates?.length || 0), 0)
    console.log(
      `Pagination completed. Collected ${totalRates} total rates across ${pageCount} pages`,
    )
    productsRates.forEach((p) => {
      if (p.interestRates && p.interestRates.length > 0) {
        console.log(`  Product ${p.id}: ${p.interestRates.length} rates`)
      }
    })

    const historicalRates: GetHistoricalArksRatesQuery = { products: productsRates as any }

    const blockIndex = buildBlockTimestampIndex(historicalRates)
    const getBaseRateAt = buildProductRateAccessors(historicalRates)
    const vaultCache = new Map<number, HistoricalVaultsQuery>()

    // Walk through time windows
    for (let t = deletionStart; t <= endTs; t += interval!) {
      await db.transaction().execute(async (trx) => {
        console.log('Getting reward totals for', { network, productIds, t })
        // Reward aggregates update
        const rewardTotals = await getRewardTotalsAt(trx, network, productIds, t)
        await updateRewardAggregates(trx, networkStatus, products, rewardTotals, t)

        // Fleet interest rate calculation requires block context
        const closest = findClosestBlock(blockIndex, t)
        if (!closest) {
          logger.debug('No historical block for timestamp, skipping fleet calc', { t })
          return
        }
        const blockNumber = closest.blockNumber
        let vaultData = vaultCache.get(blockNumber)
        if (!vaultData) {
          vaultData = await retrySubgraphQuery<HistoricalVaultsQuery>(
            () => protocolClient.HistoricalVaults({ blockNumber }),
            { logger, context: { operation: 'GetHistoricalVaults', blockNumber, network } },
          )
          vaultCache.set(blockNumber, vaultData)
        }

        // Find our vault state at this block
        const vaultState = vaultData.vaults.find(
          (v) => v.id.toLowerCase() === vault.id.toLowerCase(),
        )
        if (!vaultState) {
          logger.debug('Vault state not found at block, skipping', { blockNumber })
          return
        }

        const arksWithTvl = vaultState.arks.filter((ark) => +ark.totalValueLockedUSD > 0)
        const fleetTvl = arksWithTvl.reduce((acc, ark) => acc + +ark.totalValueLockedUSD, 0)
        let weightedFleetRate = 0
        if (fleetTvl > 0) {
          console.log('Calculating weighted fleet rate for', { fleetTvl, arksWithTvl })
          const arksWithRatios = arksWithTvl.map((ark) => ({
            ...ark,
            ratio: +ark.totalValueLockedUSD / fleetTvl,
          }))
          weightedFleetRate = arksWithRatios.reduce((acc, ark) => {
            const baseRate = getBaseRateAt(ark.productId, t)
            const rewardRate = rewardTotals[ark.productId] ?? 0
            const totalRate = baseRate + rewardRate
            return acc + totalRate * ark.ratio
          }, 0)
        }

        // Store base fleet rate and update aggregates
        await trx
          .insertInto('fleetInterestRate')
          .values({
            id: `${network}-${vault.id}-${t}`,
            timestamp: t,
            rate: weightedFleetRate.toString(),
            network,
            fleetAddress: vault.id,
          })
          .execute()

        console.log('Updating hourly, daily, and weekly vault APR for', { network, fleet, t })
        const { hourTimestamp, dayTimestamp, weekTimestamp } = computePeriodTimestamps(t)
        await updateHourlyVaultApr(
          trx,
          networkStatus,
          weightedFleetRate.toString(),
          hourTimestamp,
          vault.id,
        )
        await updateDailyVaultApr(
          trx,
          networkStatus,
          weightedFleetRate.toString(),
          dayTimestamp,
          vault.id,
        )
        await updateWeeklyVaultApr(
          trx,
          networkStatus,
          weightedFleetRate.toString(),
          weekTimestamp,
          vault.id,
        )
      })
    }

    logger.info('Standalone backfill completed', { network, fleet, from: deletionStart, to: endTs })
  } finally {
    await db.destroy()
  }
}

run().catch((err) => {
  logger.error('Standalone backfill failed', {
    error: err instanceof Error ? err.message : String(err),
  })
  process.exit(1)
})
