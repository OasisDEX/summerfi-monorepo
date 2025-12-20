import type { Context, EventBridgeEvent } from 'aws-lambda'
import { Logger } from '@aws-lambda-powertools/logger'
import { getSummerProtocolDB, Network } from '@summerfi/summer-protocol-db'
import process from 'node:process'
import {
  getAllClients as getAllRatesSubgraphClients,
  SubgraphClient as RatesSubgraphClient,
  Products,
  Product,
} from '@summerfi/summer-earn-rates-subgraph'
import {
  getAllClients as getAllProtocolSubgraphClients,
  VaultsQuery,
} from '@summerfi/summer-earn-protocol-subgraph'
import {
  getAllClients as getAllInstitutionsSubgraphClients,
  VaultsQuery as InstitutionsVaultsQuery,
} from '@summerfi/summer-earn-institutions-subgraph'

import { RewardsService } from './rewards-service'
import { Transaction } from 'kysely'
import { Database, mapDbNetworkToChainId } from '@summerfi/summer-protocol-db'
import { ChainId } from '@summerfi/serverless-shared'

import { GetArksRatesQuery, GetProductsQuery } from '@summerfi/summer-earn-rates-subgraph'

const logger = new Logger({ serviceName: 'update-summer-earn-rewards-apr', logLevel: 'DEBUG' })

export enum Protocol {
  Morpho = 'Morpho',
  Euler = 'Euler',
  Aave = 'AaveV3',
  Gearbox = 'Gearbox',
  Moonwell = 'Moonwell',
  Silo = 'Silo',
  CompoundV3 = 'CompoundV3',
  Fluid = 'Fluid',
}
const supportedProtocols = [
  Protocol.Morpho,
  Protocol.Euler,
  Protocol.Aave,
  Protocol.Gearbox,
  Protocol.Moonwell,
  Protocol.Silo,
  Protocol.CompoundV3,
  Protocol.Fluid,
]

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

type VaultsForApr = {
  vaults: Array<{
    id: string
    arks: Array<{
      id: string
      productId: string
      totalValueLockedUSD: number
      vault: { id: string }
    }>
  }>
}

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

export async function updateVaultAprs(
  trx: Transaction<Database>,
  network: NetworkStatus,
  updateStartTimestamp: number,
  vaults: VaultsForApr,
  rateSubgraphClients: Record<ChainId, RatesSubgraphClient>,
) {
  const chainId = mapDbNetworkToChainId(network.network)
  logger.debug('Starting updateVaultAprs', { network: network.network, chainId })

  const rateSubgraphClient = rateSubgraphClients[chainId]

  logger.debug('Retrieved vaults', {
    network: network.network,
    vaultCount: vaults.vaults.length,
    vaults: vaults.vaults.map((v) => ({ id: v.id, arkCount: v.arks.length })),
  })

  const arksWithTvl = vaults.vaults.flatMap((vault) =>
    vault.arks.filter((ark) => +ark.totalValueLockedUSD > 0),
  )
  logger.debug('Filtered arks with TVL', {
    network: network.network,
    arkCount: arksWithTvl.length,
    arks: arksWithTvl.map((ark) => ({ id: ark.id, tvl: ark.totalValueLockedUSD })),
  })

  for (const vault of vaults.vaults) {
    const fleetArksWithTvl = arksWithTvl.filter((ark) => ark.vault.id === vault.id)
    const fleetTvl = fleetArksWithTvl.reduce((acc, ark) => acc + +ark.totalValueLockedUSD, 0)
    logger.debug('Calculated fleet TVL', { network: network.network, fleetTvl })
    if (fleetTvl === 0) {
      logger.debug('Skipping vault APR updates - no TVL', {
        network: network.network,
        vaultId: vault.id,
      })
      continue
    }

    const fleetArksWithRatios = fleetArksWithTvl.map((ark) => ({
      ...ark,
      ratio: +ark.totalValueLockedUSD / fleetTvl,
    }))
    logger.debug('Calculated ark ratios', {
      network: network.network,
      arks: fleetArksWithRatios.map((ark) => ({
        id: ark.id,
        tvl: ark.totalValueLockedUSD,
        ratio: ark.ratio,
      })),
    })
    // single query for all arks rates
    // single interest rate per productId
    const arksRates = await retrySubgraphQuery<GetArksRatesQuery>(
      () =>
        rateSubgraphClient.GetArksRates({
          productIds: fleetArksWithRatios.map((ark) => ark.productId),
        }),
      {
        logger,
        context: {
          operation: 'GetArksRates',
          network: network.network,
          productIds: fleetArksWithRatios.map((ark) => ark.productId),
        },
      },
    )

    if (!arksRates) {
      throw new Error('No ark rates retrieved')
    }

    const fleetArksRewardsRates = await trx
      .with('latest_timestamps', (qb) =>
        qb
          .selectFrom('rewardRate')
          .select(['productId', 'network'])
          .select((eb) => eb.fn.max('timestamp').as('maxTimestamp'))
          .where('network', '=', network.network)
          .where('timestamp', '>=', (updateStartTimestamp - HOUR_IN_SECONDS).toString()) // Only get rates from last hour
          .where(
            'productId',
            'in',
            fleetArksWithRatios.map((ark) => ark.productId),
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
      .select([
        'rewardRate.productId',
        'rewardRate.network',
        (eb) => eb.fn.sum('rewardRate.rate').as('rate'),
        'rewardRate.timestamp',
      ])
      .groupBy(['rewardRate.productId', 'rewardRate.network', 'rewardRate.timestamp'])
      .execute()

    logger.debug('Retrieved reward rates', {
      network: network.network,
      rewardRates: fleetArksRewardsRates.map((r) => ({
        productId: r.productId,
        rate: r.rate,
      })),
    })

    const arksRewardsRatesMap = new Map(fleetArksRewardsRates.map((rate) => [rate.productId, rate]))

    const fleetArksTotalRates = arksRates.products.map((product) => ({
      ...product,
      interestRates: product.interestRates.map((rate) => {
        const rewardRate = parseFloat(
          arksRewardsRatesMap.get(rate.productId)?.rate.toString() || '0',
        )
        const totalRate = rewardRate + +rate.rate || +rate.rate
        logger.debug('Calculated total rate', {
          network: network.network,
          productId: rate.productId,
          baseRate: rate.rate,
          rewardRate,
          totalRate,
        })
        return {
          ...rate,
          rate: totalRate,
        }
      }),
    }))

    const weightedFleetRate = fleetArksTotalRates.reduce((acc, product) => {
      const ark = fleetArksWithRatios.find(
        (ark) => ark.productId === product.interestRates[0].productId,
      )
      const contribution = +product.interestRates[0].rate * ark!.ratio
      logger.debug('Calculating weighted rate', {
        network: network.network,
        productId: product.id,
        rate: product.interestRates[0].rate,
        ratio: ark!.ratio,
        totalValueLockedUSD: ark!.totalValueLockedUSD,
        contribution,
        accumulatedTotal: acc + contribution,
      })
      return acc + contribution
    }, 0)

    logger.debug('Final weighted fleet rate', {
      network: network.network,
      weightedFleetRate,
      timestamp: updateStartTimestamp,
    })

    // Calculate period timestamps
    const hourTimestamp = Math.floor(updateStartTimestamp / HOUR_IN_SECONDS) * HOUR_IN_SECONDS
    const dayTimestamp = Math.floor(updateStartTimestamp / DAY_IN_SECONDS) * DAY_IN_SECONDS
    const offsetTimestamp = updateStartTimestamp + EPOCH_WEEK_OFFSET
    const weekTimestamp =
      Math.floor(offsetTimestamp / WEEK_IN_SECONDS) * WEEK_IN_SECONDS - EPOCH_WEEK_OFFSET

    await trx
      .insertInto('fleetInterestRate')
      .values({
        id: `${network.network}-${vault.id}-${updateStartTimestamp}`,
        timestamp: updateStartTimestamp,
        rate: weightedFleetRate.toString(),
        network: network.network,
        fleetAddress: vault.id,
      })
      .execute()

    // Update hourly average
    await updateHourlyVaultApr(trx, network, weightedFleetRate.toString(), hourTimestamp, vault.id)

    // Update daily average
    await updateDailyVaultApr(trx, network, weightedFleetRate.toString(), dayTimestamp, vault.id)

    // Update weekly average
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

async function updateRewardRates(
  trx: Transaction<Database>,
  network: NetworkStatus,
  products: Product[],
  updateStartTimestamp: number,
  ratesSubgraphClient: RatesSubgraphClient,
) {
  const chainId = mapDbNetworkToChainId(network.network)
  const rewardsService = new RewardsService(logger, ratesSubgraphClient)
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
      const rewardRateId = `${product.id}-${currentTimestamp}-${rewardRate.rewardToken}-${rewardRate.index}`
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
  if (newRate === '0') {
    return
  }
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
  if (newRate === '0') {
    return
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
  if (newRate === '0') {
    return
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

async function getSupportedProducts(
  client: RatesSubgraphClient,
  network: Network,
): Promise<Products> {
  const results = await retrySubgraphQuery<GetProductsQuery>(
    () => client.GetProducts({ protocols: supportedProtocols }),
    {
      logger,
      context: {
        operation: 'GetProducts',
        network,
      },
    },
  )
  return results.products
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

  // await backfillFleetRates()
  const { db } = await getSummerProtocolDB(dbConfig)

  try {
    const ratesSubgraphClients = getAllRatesSubgraphClients(SUBGRAPH_BASE)
    const protocolSubgraphClients = getAllProtocolSubgraphClients(SUBGRAPH_BASE)
    const institutionsSubgraphClients = getAllInstitutionsSubgraphClients(SUBGRAPH_BASE)

    // rounded to full minutes
    const updateStartTimestamp = Math.floor(Date.now() / 1000 / 60) * 60

    // Get all potential networks
    const allNetworks = (await db.selectFrom('networkStatus').selectAll().execute()).filter(
      (network) =>
        network.network === 'mainnet' ||
        network.network === 'arbitrum' ||
        network.network === 'base' ||
        network.network === 'sonic',
    )

    logger.debug('Starting network processing', { networkCount: allNetworks.length })

    for (const network of allNetworks) {
      logger.debug('Processing network', { network: network.network })
      try {
        // First transaction for reward rates
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

          // Main processing for rewards
          const chainId = mapDbNetworkToChainId(updatedNetwork.network)
          const ratesSubgraphClient = ratesSubgraphClients[chainId]
          const products = await getSupportedProducts(ratesSubgraphClient, updatedNetwork.network)

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

            await updateRewardRates(
              trx,
              updatedNetwork,
              products,
              updateStartTimestamp,
              ratesSubgraphClient,
            )

            logger.debug('Updated reward rates', {
              network: updatedNetwork.network,
              timestamp: updateStartTimestamp,
            })
          }

          // Update network status
          await trx
            .updateTable('networkStatus')
            .set({
              lastUpdatedAt: updateStartTimestamp,
              lastBlockNumber: updatedNetwork.lastBlockNumber,
              isUpdating: false,
            })
            .where('network', '=', network.network)
            .execute()
        })

        // Second transaction for vault APRs
        try {
          await db.transaction().execute(async (trx) => {
            // Attempt to acquire lock within transaction
            const updatedNetwork = await trx
              .updateTable('networkStatus')
              .set({ isUpdating: true })
              .where('network', '=', network.network)
              .where('isUpdating', '=', false)
              .returningAll()
              .executeTakeFirst()

            if (!updatedNetwork) {
              logger.debug('Skipping vault APR updates - lock not acquired', {
                network: network.network,
              })
              return
            }

            try {
              const protocolSubgraphClient =
                protocolSubgraphClients[mapDbNetworkToChainId(network.network)]

              const vaults = await retrySubgraphQuery<VaultsQuery>(
                () => protocolSubgraphClient.Vaults(),
                {
                  logger,
                  context: {
                    operation: 'GetVaults',
                    network: network.network,
                  },
                },
              )

              if (vaults.vaults.length > 0) {
                await updateVaultAprs(
                  trx,
                  network,
                  updateStartTimestamp,
                  vaults,
                  ratesSubgraphClients,
                )
                logger.debug('Updated vault APRs successfully', {
                  network: network.network,
                })
              }
            } finally {
              // Always release the lock, even if there's an error
              await trx
                .updateTable('networkStatus')
                .set({ isUpdating: false })
                .where('network', '=', network.network)
                .execute()
            }
          })
        } catch (vaultError) {
          logger.error(`Error updating vault APRs for network ${network.network}`, {
            error: vaultError instanceof Error ? vaultError.message : String(vaultError),
            stack: vaultError instanceof Error ? vaultError.stack : undefined,
            network: network.network,
            timestamp: updateStartTimestamp,
          })
        }

        // Third transaction for institutions vault APRs
        try {
          await db.transaction().execute(async (trx) => {
            // Attempt to acquire lock within transaction
            const updatedNetwork = await trx
              .updateTable('networkStatus')
              .set({ isUpdating: true })
              .where('network', '=', network.network)
              .where('isUpdating', '=', false)
              .returningAll()
              .executeTakeFirst()

            if (!updatedNetwork) {
              logger.debug('Skipping vault APR updates - lock not acquired', {
                network: network.network,
              })
              return
            }

            try {
              const institutionsSubgraphClient =
                institutionsSubgraphClients[mapDbNetworkToChainId(network.network)]
              const institutionsVaults = await retrySubgraphQuery<InstitutionsVaultsQuery>(
                () => institutionsSubgraphClient.Vaults(),
                {
                  logger,
                  context: {
                    operation: 'GetInstitutions',
                    network: network.network,
                  },
                },
              )
              if (institutionsVaults.vaults.length > 0) {
                await updateVaultAprs(
                  trx,
                  network,
                  updateStartTimestamp,
                  institutionsVaults,
                  ratesSubgraphClients,
                )
              }
            } finally {
              // Always release the lock, even if there's an error
              await trx
                .updateTable('networkStatus')
                .set({ isUpdating: false })
                .where('network', '=', network.network)
                .execute()
            }
          })
        } catch (vaultError) {
          logger.error(`Error updating vault APRs for network ${network.network}`, {
            error: vaultError instanceof Error ? vaultError.message : String(vaultError),
            stack: vaultError instanceof Error ? vaultError.stack : undefined,
            network: network.network,
            timestamp: updateStartTimestamp,
          })
        }
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
  } catch (error) {
    logger.error('Error in update-summer-earn-rewards-apr handler', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
  } finally {
    await db.destroy()
  }
}

export default handler
