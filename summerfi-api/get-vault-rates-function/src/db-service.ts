import {
  getSummerProtocolDB,
  mapChainIdToDbNetwork,
  SummerProtocolDB,
  PgSummerProtocolDbConfig,
} from '@summerfi/summer-protocol-db'
import { Logger } from '@aws-lambda-powertools/logger'
import { HistoricalFleetRateResult, FleetRate } from '@summerfi/app-types'

const logger = new Logger({ serviceName: 'vault-rates-db-service' })

export interface FleetWithChainId {
  chainId: string
  fleetAddress: string
}

export interface FleetRateResult {
  chainId: string
  fleetAddress: string
  sma: {
    sma24h: string | null
    sma7d: string | null
    sma30d: string | null
  }
  rates: FleetRate[]
}

export class VaultRatesService {
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

      logger.info('Vault rates service initialization completed successfully')
    } catch (error) {
      logger.error('Failed to initialize vault rates service', {
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
          const [rates, hourlyRates, dailyRates] = await Promise.all([
            this.db!.db.selectFrom('fleetInterestRate')
              .select(['id', 'rate', 'timestamp', 'fleetAddress'])
              .where('network', '=', network as any)
              .where('fleetAddress', 'in', Array.from(fleetAddresses))
              .orderBy('timestamp', 'desc')
              .limit(first * fleetAddresses.size)
              .execute(),

            this.db!.db.selectFrom('hourlyFleetInterestRate')
              .select(['id', 'averageRate', 'date', 'fleetAddress'])
              .where('network', '=', network as any)
              .where('fleetAddress', 'in', Array.from(fleetAddresses))
              .orderBy('date', 'desc')
              .limit(24 * fleetAddresses.size)
              .execute(),

            this.db!.db.selectFrom('dailyFleetInterestRate')
              .select(['id', 'averageRate', 'date', 'fleetAddress'])
              .where('network', '=', network as any)
              .where('fleetAddress', 'in', Array.from(fleetAddresses))
              .orderBy('date', 'desc')
              .limit(30 * fleetAddresses.size)
              .execute(),
          ])
          // calculate sma24 for each fleet address
          const hourlyRatesByFleet = hourlyRates.reduce(
            (acc, rate) => {
              if (!acc[rate.fleetAddress]) {
                acc[rate.fleetAddress] = []
              }
              acc[rate.fleetAddress].push(rate.averageRate)
              return acc
            },
            {} as Record<string, string[]>,
          )

          const dailyRatesByFleet = dailyRates.reduce(
            (acc, rate) => {
              if (!acc[rate.fleetAddress]) {
                acc[rate.fleetAddress] = []
              }
              acc[rate.fleetAddress].push({
                rate: rate.averageRate,
                date: new Date(rate.date).getTime(),
              })
              return acc
            },
            {} as Record<string, Array<{ rate: string; date: number }>>,
          )

          // Sort daily rates for each fleet by date (most recent first)
          Object.values(dailyRatesByFleet).forEach((rates) => {
            rates.sort((a, b) => b.date - a.date)
          })

          const sma24ByFleet = Object.entries(hourlyRatesByFleet).map(([fleetAddress, rates]) => {
            const sma24 =
              rates.length > 0
                ? rates.reduce((acc, rate) => acc + Number(rate), 0) / rates.length
                : 0
            return {
              fleetAddress,
              sma24,
            }
          })

          const sma7dByFleet = Object.entries(dailyRatesByFleet).map(([fleetAddress, rates]) => {
            const last7Days = rates.slice(0, 7)
            const sma7d =
              last7Days.length > 0
                ? last7Days.reduce((acc, { rate }) => acc + Number(rate), 0) / last7Days.length
                : 0
            return {
              fleetAddress,
              sma7d,
            }
          })

          const sma30dByFleet = Object.entries(dailyRatesByFleet).map(([fleetAddress, rates]) => {
            const last30Days = rates.slice(0, 30)
            const sma30d =
              last30Days.length > 0
                ? last30Days.reduce((acc, { rate }) => acc + Number(rate), 0) / last30Days.length
                : 0
            return {
              fleetAddress,
              sma30d,
            }
          })

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
            sma: {
              sma24h:
                sma24ByFleet.find((rate) => rate.fleetAddress === fleetAddress)?.sma24.toString() ||
                null,
              sma7d:
                sma7dByFleet.find((rate) => rate.fleetAddress === fleetAddress)?.sma7d.toString() ||
                null,
              sma30d:
                sma30dByFleet
                  .find((rate) => rate.fleetAddress === fleetAddress)
                  ?.sma30d.toString() || null,
            },
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

  async getHistoricalRates(pairs: FleetWithChainId[]): Promise<HistoricalFleetRateResult[]> {
    if (!this.db) {
      logger.error('Database connection not initialized')
      return []
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

          // return needs to be a list, one per fleet address.
          return fleetAddressesArray.map((fleetAddress) => ({
            chainId,
            fleetAddress,
            data: {
              dailyRates: dailyRates
                .filter((rate) => rate.fleetAddress === fleetAddress)
                .map((rate) => ({
                  id: rate.id,
                  averageRate: rate.averageRate.toString(),
                  date: rate.date.toString(),
                  fleetAddress: rate.fleetAddress,
                })),
              hourlyRates: hourlyRates
                .filter((rate) => rate.fleetAddress === fleetAddress)
                .map((rate) => ({
                  id: rate.id,
                  averageRate: rate.averageRate.toString(),
                  date: rate.date.toString(),
                  fleetAddress: rate.fleetAddress,
                })),
              weeklyRates: weeklyRates
                .filter((rate) => rate.fleetAddress === fleetAddress)
                .map((rate) => ({
                  id: rate.id,
                  averageRate: rate.averageRate.toString(),
                  date: rate.date.toString(),
                  fleetAddress: rate.fleetAddress,
                })),
              latestRate: latestRates
                .filter((rate) => rate.fleetAddress === fleetAddress)
                .map((rate) => ({
                  id: rate.id,
                  rate: rate.rate.toString(),
                  timestamp: Number(rate.timestamp),
                  fleetAddress: rate.fleetAddress,
                })),
            },
          }))
        }),
      )
      return results.flat().map((result) => ({
        chainId: result.chainId,
        fleetAddress: result.fleetAddress,
        rates: result.data,
      }))
    } catch (error) {
      logger.error('Error fetching historical fleet rates from DB', { error, pairs })
      return []
    }
  }
}
