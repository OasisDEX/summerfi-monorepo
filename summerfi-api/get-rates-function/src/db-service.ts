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
  private static instance: RatesService | null = null
  private db: SummerProtocolDB | null = null
  private isInitializing = false
  private initPromise: Promise<void> | null = null

  static getInstance(): RatesService {
    if (!RatesService.instance) {
      RatesService.instance = new RatesService()
    }
    return RatesService.instance
  }

  private constructor() {}

  async init() {
    // If already initialized, return immediately
    if (this.db) {
      return
    }

    // If initialization is in progress, wait for it
    if (this.initPromise) {
      await this.initPromise
      return
    }

    // Start new initialization
    this.isInitializing = true
    this.initPromise = this.initializeDB()

    try {
      await this.initPromise
    } finally {
      this.isInitializing = false
      this.initPromise = null
    }
  }

  private async initializeDB() {
    if (!process.env.EARN_PROTOCOL_DB_CONNECTION_STRING) {
      logger.warn('Database connection string not provided')
      return
    }

    try {
      const config: PgSummerProtocolDbConfig = {
        connectionString: process.env.EARN_PROTOCOL_DB_CONNECTION_STRING,
        pool: {
          max: 1,
          idleTimeoutMillis: 5000,
          acquireTimeoutMillis: 3000,
        },
      }

      this.db = await getSummerProtocolDB(config)
      logger.info('Database connection initialized successfully')
    } catch (error) {
      logger.error('Failed to initialize database connection', {
        error,
        connectionString: process.env.EARN_PROTOCOL_DB_CONNECTION_STRING?.substring(0, 10) + '...',
      })
      throw new Error('Database initialization failed')
    }
  }

  async getLatestRates(chainId: string, productId: string): Promise<DBRate[]> {
    if (!this.db) {
      logger.error('Database connection not initialized')
      return []
    }

    const network = mapChainIdToDbNetwork(chainId)
    logger.info('Fetching latest rates', { chainId, network, productId })

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
