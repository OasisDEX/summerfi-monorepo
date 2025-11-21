import { Logger } from '@aws-lambda-powertools/logger'
import { getSummerProtocolDB, mapDbNetworkToChainId } from '@summerfi/summer-protocol-db'
import {
  getAllClients as getAllRatesSubgraphClients,
  GetHistoricalArksRatesQuery,
} from '@summerfi/summer-earn-rates-subgraph'

import { Database } from '@summerfi/summer-protocol-db'
import { HistoricalVaultsQuery } from '@summerfi/summer-earn-protocol-subgraph'
import { Transaction } from 'kysely'
import {
  retrySubgraphQuery,
  updateHourlyVaultApr,
  updateDailyVaultApr,
  updateWeeklyVaultApr,
} from '..'
import { HOUR_IN_SECONDS, DAY_IN_SECONDS, WEEK_IN_SECONDS, EPOCH_WEEK_OFFSET } from '..'
import { NetworkStatus } from '..'
import {
  SubgraphClient as ProtocolSubgraphClient,
  VaultsQuery,
  getAllClients as getAllProtocolSubgraphClients,
} from '@summerfi/summer-earn-protocol-subgraph'
import dotenv from 'dotenv'

dotenv.config()

const logger = new Logger({ serviceName: 'backfill-fleet-rates' })

const START_BACKFILL_TIMESTAMP = 1762531200

export const MIN_UPDATE_INTERVAL = 10 * 60 // 10 minutes in seconds

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
    logger.info('Buffer ark', { network: network.network, vaultId: vault.id })
    const arksWithTvl = vault.arks.filter((ark) => +ark.totalValueLockedUSD > 0)
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

      // Create a map of reward rates
      const rewardRatesMap = new Map(rewardRates.map((rate) => [rate.productId, rate.rate]))

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

export async function backfillFleetRates() {
  const { SUBGRAPH_BASE, EARN_PROTOCOL_DB_CONNECTION_STRING } = process.env

  if (!EARN_PROTOCOL_DB_CONNECTION_STRING || !SUBGRAPH_BASE) {
    throw new Error('Missing required environment variabdles')
  }

  const { db } = await getSummerProtocolDB({
    connectionString: EARN_PROTOCOL_DB_CONNECTION_STRING,
  })

  try {
    const startTimestamp = START_BACKFILL_TIMESTAMP
    const endTimestamp = Math.floor(Date.now() / 1000)

    logger.info('Starting backfill', { startTimestamp, endTimestamp })

    const allNetworks = (await db.selectFrom('networkStatus').selectAll().execute()).filter(
      (network) => network.network == 'sonic',
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
      const TEN_MINUTES_IN_SECONDS = 10 * 60
      // Process each timestamp interval
      for (const blockTimestamp of blockTimestampMap) {
        console.log('Processing block timestamp', { blockTimestamp })
        try {
          console.log('Checking for existing data')
          await db.transaction().execute(async (trx) => {
            // Check for existing data
            const existing = await trx
              .selectFrom('fleetInterestRate')
              .select(['timestamp'])
              .where('timestamp', '<=', blockTimestamp[1].toString())
              .where('timestamp', '>', (blockTimestamp[1] - TEN_MINUTES_IN_SECONDS).toString())
              .where('network', '=', network.network)
              .executeTakeFirst()

            if (existing) {
              logger.info('Data exists, skipping', {
                block: blockTimestamp[1],
                network: network.network,
                timeIso: new Date(blockTimestamp[1] * 1000).toISOString(),
                existing: existing.timestamp,
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
              logger.info('No relevant rates found', {
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
                  .where('timestamp', '>=', (blockTimestamp[1] - HOUR_IN_SECONDS).toString()) // Only get rates from last hour
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
            console.log('xxxRetrieved reward rates', { rewardRates: rewardRates.length })
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
  } catch (error) {
    logger.error('Error in backfillFleetRates', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
  } finally {
    await db.destroy()
  }
}

backfillFleetRates().catch((error) => {
  console.error(error)
  logger.error('Script failed', {
    error: error instanceof Error ? error.message : String(error),
  })
  process.exit(1)
})
