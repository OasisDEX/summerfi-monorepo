import {
  getSummerProtocolDB,
  mapChainIdToDbNetwork,
  SummerProtocolDB,
  PgSummerProtocolDbConfig,
} from '@summerfi/summer-protocol-db'
import { Logger } from '@aws-lambda-powertools/logger'

const logger = new Logger({ serviceName: 'rates-db-service' })

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
      const rates = await this.db.db
        .selectFrom('rewardRate')
        .select(['id', 'rate', 'timestamp', 'productId'])
        .where('network', '=', network)
        .where('productId', '=', productId)
        .orderBy('timestamp', 'desc')
        .limit(100)
        .execute()

      return rates.map((rate) => ({
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
          .orderBy('timestamp', 'desc')
          .limit(1)
          .execute(),
      ])

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
          latestRate.length > 0
            ? [
                {
                  rate: [
                    {
                      id: latestRate[0].id,
                      rate: latestRate[0].rate.toString(),
                      timestamp: latestRate[0].timestamp.toString(),
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
}
