import {
  getSummerProtocolDB,
  mapChainIdToDbNetwork,
  SummerProtocolDB,
  PgSummerProtocolDbConfig,
} from '@summerfi/summer-protocol-db'
import { Logger } from '@aws-lambda-powertools/logger'

const logger = new Logger({ serviceName: 'vault-rates-db-service' })

export interface FleetRate {
  id: string
  rate: string
  timestamp: number
  fleetAddress: string
}

export interface AggregatedFleetRate {
  id: string
  averageRate: string
  date: string
  fleetAddress: string
}

export interface HistoricalFleetRates {
  dailyRates: AggregatedFleetRate[]
  hourlyRates: AggregatedFleetRate[]
  weeklyRates: AggregatedFleetRate[]
  latestRate: FleetRate[]
}

export interface FleetWithChainId {
  chainId: string
  fleetAddress: string
}

export interface FleetRateResult {
  chainId: string
  fleetAddress: string
  rates: FleetRate[]
}

export class VaultRatesService {
  private static instance: VaultRatesService | null = null
  private db: SummerProtocolDB | null = null
  private isInitializing = false
  private initPromise: Promise<void> | null = null

  static getInstance(): VaultRatesService {
    if (!VaultRatesService.instance) {
      VaultRatesService.instance = new VaultRatesService()
    }
    return VaultRatesService.instance
  }

  private constructor() {}

  async init() {
    if (this.db) return
    if (this.initPromise) {
      await this.initPromise
      return
    }

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
          idleTimeoutMillis: 10000,
          acquireTimeoutMillis: 10000,
        },
      }

      this.db = await getSummerProtocolDB(config)
      logger.info('Database connection initialized successfully')
    } catch (error) {
      logger.error('Failed to initialize database connection', { error })
      throw new Error('Database initialization failed')
    }
  }

  async getLatestRates(pairs: FleetWithChainId[], first: number = 1): Promise<FleetRateResult[]> {
    if (!this.db) {
      logger.error('Database connection not initialized')
      return []
    }

    logger.info('Fetching latest fleet rates', { pairs, first })

    try {
      // Group pairs by chainId for efficient querying
      const chainGroups = pairs.reduce(
        (acc, pair) => {
          const network = mapChainIdToDbNetwork(pair.chainId)
          if (!acc[network]) {
            acc[network] = {
              network,
              chainId: pair.chainId,
              fleetAddresses: new Set<string>(),
            }
          }
          acc[network].fleetAddresses.add(pair.fleetAddress)
          return acc
        },
        {} as Record<string, { network: string; chainId: string; fleetAddresses: Set<string> }>,
      )

      // Query each chain's data in parallel
      const results = await Promise.all(
        Object.values(chainGroups).map(async ({ network, chainId, fleetAddresses }) => {
          const rates = await this.db!.db.selectFrom('fleetInterestRate')
            .select(['id', 'rate', 'timestamp', 'fleetAddress'])
            .where('network', '=', network as any)
            .where('fleetAddress', 'in', Array.from(fleetAddresses))
            .orderBy('timestamp', 'desc')
            .limit(first * fleetAddresses.size)
            .execute()

          // Group rates by fleet address
          const ratesByFleet = rates.reduce(
            (acc, rate) => {
              if (!acc[rate.fleetAddress]) {
                acc[rate.fleetAddress] = []
              }
              acc[rate.fleetAddress].push({
                id: rate.id,
                rate: rate.rate.toString(),
                timestamp: Number(rate.timestamp),
                fleetAddress: rate.fleetAddress,
              })
              return acc
            },
            {} as Record<string, FleetRate[]>,
          )

          // Create result for each requested fleet address
          return Array.from(fleetAddresses).map((fleetAddress) => ({
            chainId,
            fleetAddress,
            rates: (ratesByFleet[fleetAddress] || []).slice(0, first),
          }))
        }),
      )

      return results.flat()
    } catch (error) {
      logger.error('Error fetching latest fleet rates from DB', { error, pairs, first })
      return []
    }
  }

  async getHistoricalRates(
    pairs: FleetWithChainId[],
  ): Promise<Record<string, HistoricalFleetRates>> {
    if (!this.db) {
      logger.error('Database connection not initialized')
      return {}
    }

    logger.info('Fetching historical fleet rates', { pairs })

    try {
      // Group pairs by chainId
      const chainGroups = pairs.reduce(
        (acc, pair) => {
          const network = mapChainIdToDbNetwork(pair.chainId)
          if (!acc[network]) {
            acc[network] = {
              network,
              chainId: pair.chainId,
              fleetAddresses: new Set<string>(),
            }
          }
          acc[network].fleetAddresses.add(pair.fleetAddress)
          return acc
        },
        {} as Record<string, { network: string; chainId: string; fleetAddresses: Set<string> }>,
      )

      const results = await Promise.all(
        Object.values(chainGroups).map(async ({ network, chainId, fleetAddresses }) => {
          const fleetAddressesArray = Array.from(fleetAddresses)
          const [dailyRates, hourlyRates, weeklyRates, latestRates] = await Promise.all([
            this.db!.db.selectFrom('dailyFleetInterestRate')
              .select(['id', 'averageRate', 'date', 'fleetAddress'])
              .where('network', '=', network as any)
              .where('fleetAddress', 'in', fleetAddressesArray)
              .orderBy('date', 'desc')
              .limit(365 * fleetAddresses.size)
              .execute(),

            this.db!.db.selectFrom('hourlyFleetInterestRate')
              .select(['id', 'averageRate', 'date', 'fleetAddress'])
              .where('network', '=', network as any)
              .where('fleetAddress', 'in', fleetAddressesArray)
              .orderBy('date', 'desc')
              .limit(720 * fleetAddresses.size)
              .execute(),

            this.db!.db.selectFrom('weeklyFleetInterestRate')
              .select(['id', 'averageRate', 'weekTimestamp as date', 'fleetAddress'])
              .where('network', '=', network as any)
              .where('fleetAddress', 'in', fleetAddressesArray)
              .orderBy('weekTimestamp', 'desc')
              .limit(156 * fleetAddresses.size)
              .execute(),

            this.db!.db.selectFrom('fleetInterestRate')
              .select(['id', 'rate', 'timestamp', 'fleetAddress'])
              .where('network', '=', network as any)
              .where('fleetAddress', 'in', fleetAddressesArray)
              .orderBy('timestamp', 'desc')
              .limit(fleetAddresses.size)
              .execute(),
          ])

          return {
            chainId,
            data: {
              dailyRates: dailyRates.map((rate) => ({
                id: rate.id,
                averageRate: rate.averageRate.toString(),
                date: rate.date.toString(),
                fleetAddress: rate.fleetAddress,
              })),
              hourlyRates: hourlyRates.map((rate) => ({
                id: rate.id,
                averageRate: rate.averageRate.toString(),
                date: rate.date.toString(),
                fleetAddress: rate.fleetAddress,
              })),
              weeklyRates: weeklyRates.map((rate) => ({
                id: rate.id,
                averageRate: rate.averageRate.toString(),
                date: rate.date.toString(),
                fleetAddress: rate.fleetAddress,
              })),
              latestRate: latestRates.map((rate) => ({
                id: rate.id,
                rate: rate.rate.toString(),
                timestamp: Number(rate.timestamp),
                fleetAddress: rate.fleetAddress,
              })),
            },
          }
        }),
      )

      // Convert results to record
      return results.reduce(
        (acc, { chainId, data }) => {
          acc[chainId] = data
          return acc
        },
        {} as Record<string, HistoricalFleetRates>,
      )
    } catch (error) {
      logger.error('Error fetching historical fleet rates from DB', { error, pairs })
      return {}
    }
  }
}
