import {
  getSummerProtocolDB,
  mapChainIdToDbNetwork,
  SummerProtocolDB,
} from '@summerfi/summer-protocol-db'
import { Logger } from '@aws-lambda-powertools/logger'

const logger = new Logger({ serviceName: 'rates-db-service' })

export interface DBRate {
  id: string
  rate: string
  timestamp: number
  productId: string
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

  async init() {
    if (!process.env.EARN_PROTOCOL_DB_CONNECTION_STRING) {
      logger.warn('Database connection string not provided')
      return
    }

    this.db = await getSummerProtocolDB({
      connectionString: process.env.EARN_PROTOCOL_DB_CONNECTION_STRING,
    })
  }

  async getLatestRates(chainId: string, productId: string): Promise<DBRate[]> {
    if (!this.db) return []
    const network = mapChainIdToDbNetwork(chainId)
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
      logger.error('Error fetching latest rates from DB', { error, chainId, productId })
      return []
    }
  }

  async getHistoricalRates(chainId: string, productId: string): Promise<DBHistoricalRates | null> {
    if (!this.db) return null

    try {
      const network = mapChainIdToDbNetwork(chainId)

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
      logger.error('Error fetching historical rates from DB', { error, chainId, productId })
      return null
    }
  }
}
