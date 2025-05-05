import {
  getSummerProtocolDB,
  mapChainIdToDbNetwork,
  SummerProtocolDB,
  PgSummerProtocolDbConfig,
  DbNetworks,
} from '@summerfi/summer-protocol-db'
import { Logger } from '@aws-lambda-powertools/logger'

const logger = new Logger({ serviceName: 'rates-db-service' })

const ONE_HOUR_IN_SECONDS = 3600

export interface DBRate {
  id: string
  rate: string
  timestamp: number
  productId: string
}

export interface DBFleetRate {
  id: string
  rate: string
  timestamp: number
  fleetAddress: string
}

export interface DBAggregatedRate {
  id: string
  averageRate: string
  date: string
}

export interface DBLatestRate {
  rate: Array<{
    id: string
    rate: string
    timestamp: string
  }>
}

export interface DBHistoricalRates {
  dailyRates: DBAggregatedRate[]
  hourlyRates: DBAggregatedRate[]
  weeklyRates: DBAggregatedRate[]
  latestRate: DBLatestRate[]
}

interface BatchRateRequest {
  chainId: string
  productId: string
}

export class RatesService {
  private db: SummerProtocolDB | null = null

  constructor() {}

  async init() {
    try {
      logger.info('Initializing rates service')
      await this.initializeDB()

      // Verify initialization was successful
      if (!this.db?.db) {
        throw new Error('Database failed to initialize properly')
      }

      logger.info('Rates service initialization completed successfully')
    } catch (error) {
      logger.error('Failed to initialize rates service', {
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack, name: error.name }
            : error,
      })
      throw error
    }
  }

  private async initializeDB() {
    logger.info('Initializing database connection, getting env')
    if (!process.env.EARN_PROTOCOL_DB_CONNECTION_STRING) {
      logger.error('Database connection string not provided')
      throw new Error('Database connection string not provided')
    }

    try {
      const config: PgSummerProtocolDbConfig = {
        connectionString: process.env.EARN_PROTOCOL_DB_CONNECTION_STRING,
        pool: {
          max: 1,
          idleTimeoutMillis: 300000,
          acquireTimeoutMillis: 10000,
        },
      }

      this.db = await getSummerProtocolDB(config)

      if (!this.db?.db) {
        throw new Error('Database connection failed - db object is undefined')
      }

      logger.info('Database connection initialized successfully')
    } catch (error) {
      logger.error('Failed to initialize database connection', {
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack, name: error.name }
            : error,
      })
      throw error
    }
  }

  async destroy() {
    if (this.db?.db) {
      await this.db.db.destroy()
      this.db = null
      logger.info('Database connection destroyed')
    }
  }

  async getLatestRates(chainId: string, productId: string): Promise<DBRate[]> {
    if (!this.db || !this.db.db) {
      logger.error('Database connection not initialized or invalid', {
        dbExists: !!this.db,
        dbClientExists: !!this.db?.db,
      })
      throw new Error('Database connection not initialized')
    }

    const network = mapChainIdToDbNetwork(chainId)
    logger.info('Fetching latest rates', {
      chainId,
      network,
      productId,
      dbConnectionStatus: 'initialized',
    })

    try {
      const currentTimestampInSeconds = Math.floor(Date.now() / 1000)
      const timestampHourAgoInSeconds = (currentTimestampInSeconds - ONE_HOUR_IN_SECONDS).toString()
      // from past 1h
      const rates = await this.db.db
        .selectFrom('rewardRate')
        .select(['id', 'rate', 'timestamp', 'productId'])
        .where('network', '=', network)
        .where('productId', '=', productId)
        .where('timestamp', '>=', timestampHourAgoInSeconds)
        .orderBy('timestamp', 'desc')
        .limit(100)
        .execute()

      const ratesSummedByTimestamp = rates.reduce(
        (acc: Record<string, (typeof rates)[0]>, rate) => {
          const key = `${rate.productId}-${rate.timestamp}`
          if (!acc[key]) {
            acc[key] = rate
          } else {
            acc[key].rate = (Number(acc[key].rate) + Number(rate.rate)).toString()
          }
          return acc
        },
        {} as Record<string, (typeof rates)[0]>,
      )

      return Object.values(ratesSummedByTimestamp).map((rate) => ({
        id: rate.id,
        rate: rate.rate.toString(),
        timestamp: Number(rate.timestamp),
        productId: rate.productId,
      }))
    } catch (error) {
      logger.error('Error fetching latest rates from DB', {
        error,
        chainId,
        network,
        productId,
        errorDetails: error instanceof Error ? error.stack : undefined,
      })
      return []
    }
  }

  async getHistoricalRates(chainId: string, productId: string): Promise<DBHistoricalRates | null> {
    if (!this.db) {
      logger.error('Database connection not initialized')
      return null
    }

    const network = mapChainIdToDbNetwork(chainId)
    logger.info('Fetching historical rates', { chainId, network, productId })

    try {
      const currentTimestampInSeconds = Math.floor(Date.now() / 1000)
      const timestampHourAgoInSeconds = (currentTimestampInSeconds - ONE_HOUR_IN_SECONDS).toString()
      const [dailyRates, hourlyRates, weeklyRates, latestRate] = await Promise.all([
        this.db.db
          .selectFrom('dailyRewardRate')
          .select(['id', 'averageRate', 'date'])
          .where('network', '=', network)
          .where('productId', '=', productId)
          .orderBy('date', 'desc')
          .limit(365)
          .execute(),

        this.db.db
          .selectFrom('hourlyRewardRate')
          .select(['id', 'averageRate', 'date'])
          .where('network', '=', network)
          .where('productId', '=', productId)
          .orderBy('date', 'desc')
          .limit(720)
          .execute(),

        this.db.db
          .selectFrom('weeklyRewardRate')
          .select(['id', 'averageRate', 'weekTimestamp as date'])
          .where('network', '=', network)
          .where('productId', '=', productId)
          .orderBy('weekTimestamp', 'desc')
          .limit(156)
          .execute(),

        this.db.db
          .selectFrom('rewardRate')
          .select(['id', 'rate', 'timestamp'])
          .where('network', '=', network)
          .where('productId', '=', productId)
          .where('timestamp', '>=', timestampHourAgoInSeconds)
          .orderBy('timestamp', 'desc')
          .limit(100)
          .execute(),
      ])

      // Sum rates with same timestamp
      const summedLatestRate = latestRate.reduce(
        (acc, rate) => {
          if (!acc.length) return [rate]
          if (acc[0].timestamp === rate.timestamp) {
            acc[0].rate = (Number(acc[0].rate) + Number(rate.rate)).toString()
            return acc
          }
          return acc
        },
        [] as typeof latestRate,
      )

      return {
        dailyRates: dailyRates.map((rate) => ({
          id: rate.id,
          averageRate: rate.averageRate.toString(),
          date: rate.date.toString(),
        })),
        hourlyRates: hourlyRates.map((rate) => ({
          id: rate.id,
          averageRate: rate.averageRate.toString(),
          date: rate.date.toString(),
        })),
        weeklyRates: weeklyRates.map((rate) => ({
          id: rate.id,
          averageRate: rate.averageRate.toString(),
          date: rate.date.toString(),
        })),
        latestRate:
          summedLatestRate.length > 0
            ? [
                {
                  rate: [
                    {
                      id: summedLatestRate[0].id,
                      rate: summedLatestRate[0].rate.toString(),
                      timestamp: summedLatestRate[0].timestamp.toString(),
                    },
                  ],
                },
              ]
            : [],
      }
    } catch (error) {
      logger.error('Error fetching historical rates from DB', {
        error,
        chainId,
        network,
        productId,
        errorDetails: error instanceof Error ? error.stack : undefined,
      })
      return null
    }
  }

  async getFleetRates(chainId: string, fleetAddress: string): Promise<DBFleetRate[]> {
    if (!this.db) {
      logger.error('Database connection not initialized')
      return []
    }

    const network = mapChainIdToDbNetwork(chainId)
    logger.info('Fetching fleet rates', { chainId, network, fleetAddress })

    try {
      const rates = await this.db.db
        .selectFrom('fleetInterestRate')
        .select(['id', 'rate', 'timestamp', 'fleetAddress'])
        .where('network', '=', network)
        .where('fleetAddress', '=', fleetAddress)
        .orderBy('timestamp', 'desc')
        .limit(1)
        .execute()

      return rates.map((rate) => ({
        id: rate.id,
        rate: rate.rate.toString(),
        timestamp: Number(rate.timestamp),
        fleetAddress: rate.fleetAddress,
      }))
    } catch (error) {
      logger.error('Error fetching fleet rates from DB', {
        error,
        chainId,
        network,
        fleetAddress,
        errorDetails: error instanceof Error ? error.stack : undefined,
      })
      return []
    }
  }

  async getLatestRatesBatch(requests: BatchRateRequest[]): Promise<Record<string, DBRate[]>> {
    if (!this.db || !this.db.db) {
      logger.error('Database connection not initialized or invalid')
      throw new Error('Database connection not initialized')
    }

    const results: Record<string, DBRate[]> = {}

    // Group requests by network to minimize DB queries
    const requestsByNetwork: Record<DbNetworks, string[]> = {
      arbitrum: [],
      optimism: [],
      base: [],
      mainnet: [],
      sonic: [],
    }
    requests.forEach(({ chainId, productId }) => {
      const network = mapChainIdToDbNetwork(chainId)
      requestsByNetwork[network].push(productId)
    })

    logger.info('Fetching batch latest rates', {
      requestCount: requests.length,
      networks: Object.keys(requestsByNetwork).filter(
        (n) => requestsByNetwork[n as DbNetworks].length > 0,
      ),
    })

    try {
      // Execute one query per network for all product IDs in that network
      await Promise.all(
        Object.entries(requestsByNetwork).map(async ([network, productIds]) => {
          // Skip if no product IDs for this network
          if (productIds.length === 0) {
            return
          }
          const timestampHourAgo = (Math.floor(Date.now() / 1000) - 60 * 60).toString()
          // from past 1h
          const rates = await this.db!.db.selectFrom('rewardRate')
            .select(['id', 'rate', 'timestamp', 'productId'])
            .where('network', '=', network as DbNetworks)
            .where('productId', 'in', productIds)
            .where('timestamp', '>=', timestampHourAgo)
            .orderBy('timestamp', 'desc')
            .execute()

          // Group rates by productId and timestamp, summing rates
          rates.forEach((rate) => {
            const key = rate.productId
            if (!results[key]) {
              results[key] = []
            }

            const existingRate = results[key].find((r) => r.timestamp === Number(rate.timestamp))
            if (existingRate) {
              existingRate.rate = (Number(existingRate.rate) + Number(rate.rate)).toString()
            } else {
              results[key].push({
                id: rate.id,
                rate: rate.rate.toString(),
                timestamp: Number(rate.timestamp),
                productId: rate.productId,
              })
            }
          })
        }),
      )

      return results
    } catch (error) {
      logger.error('Error fetching batch latest rates from DB', {
        error,
        requestCount: requests.length,
        errorDetails: error instanceof Error ? error.stack : undefined,
      })
      return {}
    }
  }
}
