import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger'
import {
  getAllClients,
  type WeeklyInterestRates,
  type DailyInterestRates,
  type HourlyInterestRates,
  LatestInterestRate,
} from '@summerfi/summer-earn-rates-subgraph'
import { RatesService, DBRate, DBAggregatedRate, DBHistoricalRates } from './db-service'
import middy from '@middy/core'

const logger = new Logger({
  serviceName: 'get-rates-function',
  logLevel: 'INFO',
})
const clients = getAllClients(process.env.SUBGRAPH_BASE || '')

const TEN_MINUTES_IN_MS = 10 * 60 * 1000

export async function retrySubgraphQuery<TResponse>(
  operation: () => Promise<TResponse>,
  options: {
    retries?: number
    initialDelay?: number
    logger: Logger
    context: {
      operation: string
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
      const errorString = JSON.stringify(error)
      const isRateLimit =
        errorString.includes('"status":429') ||
        errorString.includes('Code: 429') ||
        errorString.includes('Too Many Requests')

      if (currentRetry === 1 || !(error instanceof Error) || !isRateLimit) {
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

function findMatchingDbRate(subgraphTimestamp: number, dbRates: DBRate[]) {
  return dbRates.find((dbRate) => {
    const timeDiff = Number(subgraphTimestamp) - dbRate.timestamp
    return timeDiff >= 0 && timeDiff <= TEN_MINUTES_IN_MS
  })
}

function combineRatesById(
  subgraphRates: HourlyInterestRates | DailyInterestRates | WeeklyInterestRates,
  dbRates: DBAggregatedRate[],
) {
  const dbRatesMap = new Map(dbRates.map((rate) => [rate.date, rate]))

  return subgraphRates.map((subgraphRate) => {
    // For weekly rates, use weekTimestamp, otherwise use date
    const timeKey = subgraphRate.date
    const dbRate = dbRatesMap.get(timeKey?.toString())
    const baseRate = Number(subgraphRate.averageRate)
    const rewardRate = dbRate ? Number(dbRate.averageRate) : 0

    return {
      ...subgraphRate,
      averageRate: (baseRate + rewardRate).toString(),
      nativeRate: baseRate.toString(),
      rewardRate: rewardRate.toString(),
    }
  })
}

function combineLatestRates(subgraphRate: LatestInterestRate, dbRates: DBHistoricalRates | null) {
  if (
    !dbRates ||
    !dbRates.latestRate ||
    dbRates.latestRate.length === 0 ||
    !dbRates.latestRate[0].rate
  ) {
    return {
      rate: [
        {
          ...subgraphRate[0].rate[0],
          rate: subgraphRate[0].rate[0].rate,
          rewardRate: 0,
          nativeRate: subgraphRate[0].rate[0].rate,
        },
      ],
    }
  }

  const baseRate = Number(subgraphRate[0].rate[0].rate)
  const rewardRate = Number(dbRates.latestRate[0].rate[0].rate)

  return {
    rate: [
      {
        ...subgraphRate[0].rate[0],
        rate: (baseRate + rewardRate).toString(),
        rewardRate: rewardRate.toString(),
        nativeRate: baseRate.toString(),
      },
    ],
  }
}

async function baseHandler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const ratesService = new RatesService()

  try {
    logger.info('Initializing rates service')
    await ratesService.init()

    const path = event.requestContext.http.path
    const productId = event.queryStringParameters?.productId
    const chainId = event.pathParameters?.chainId

    logger.info(`Request received for path: ${path}, productId: ${productId}, chainId: ${chainId}`)

    if (!chainId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'chainId is required' }),
      }
    }

    if (!productId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'productId is required' }),
      }
    }
    logger.info('chainId', chainId)
    logger.info('productId', productId)

    const client = clients[chainId]

    if (!client) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid chainId or productId combination' }),
      }
    }

    if (path.includes('/rates')) {
      // Get rates from both sources
      const [subgraphRates, dbRates] = await Promise.all([
        retrySubgraphQuery(() => client.GetArkRates({ productId }), {
          retries: 3,
          initialDelay: 1000,
          logger: logger,
          context: {
            operation: 'GetArkRates',
            productId: productId,
            chainId: chainId,
          },
        }),
        ratesService.getLatestRates(chainId, productId),
      ])

      // Process and combine rates
      const combinedRates = (subgraphRates?.interestRates || [])
        .map((subgraphRate) => {
          const matchingDbRate = findMatchingDbRate(Number(subgraphRate.timestamp), dbRates)

          const baseRate = Number(subgraphRate.rate)
          const rewardRate = matchingDbRate ? Number(matchingDbRate.rate) : 0

          return {
            ...subgraphRate,
            rate: (baseRate + rewardRate).toString(),
            nativeRate: baseRate.toString(),
            rewardRate: rewardRate.toString(),
          }
        })
        .slice(0, 20)

      logger.info('Combined rates result', {
        combinedRates,
        dbRatesCount: dbRates.length,
        subgraphRatesCount: subgraphRates?.interestRates?.length,
      })

      return {
        statusCode: 200,
        body: JSON.stringify({ interestRates: combinedRates }),
      }
    } else if (path.includes('/historicalRates')) {
      const [subgraphRates, dbRates] = await Promise.all([
        retrySubgraphQuery(() => client.GetInterestRates({ productId }), {
          retries: 3,
          initialDelay: 1000,
          logger: logger,
          context: {
            operation: 'GetInterestRates',
            productId: productId,
            chainId: chainId,
          },
        }),
        ratesService.getHistoricalRates(chainId, productId),
      ])

      // Combine the results with ID matching
      const result = {
        dailyInterestRates: combineRatesById(
          subgraphRates?.dailyInterestRates || [],
          dbRates?.dailyRates || [],
        ).slice(0, 365),

        hourlyInterestRates: combineRatesById(
          subgraphRates?.hourlyInterestRates || [],
          dbRates?.hourlyRates || [],
        ).slice(0, 720),

        weeklyInterestRates: combineRatesById(
          subgraphRates?.weeklyInterestRates || [],
          dbRates?.weeklyRates || [],
        ).slice(0, 156),

        latestInterestRate: subgraphRates?.latestInterestRate?.[0]
          ? [combineLatestRates(subgraphRates.latestInterestRate, dbRates)]
          : [],
      }

      logger.info('Historical rates result', {
        dailyRatesCount: {
          subgraph: subgraphRates?.dailyInterestRates?.length,
          db: dbRates?.dailyRates?.length,
          combined: result.dailyInterestRates.length,
        },
        hourlyRatesCount: {
          subgraph: subgraphRates?.hourlyInterestRates?.length,
          db: dbRates?.hourlyRates?.length,
          combined: result.hourlyInterestRates.length,
        },
        weeklyRatesCount: {
          subgraph: subgraphRates?.weeklyInterestRates?.length,
          db: dbRates?.weeklyRates?.length,
          combined: result.weeklyInterestRates.length,
        },
      })

      return {
        statusCode: 200,
        body: JSON.stringify(result),
      }
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid endpoint' }),
    }
  } catch (error) {
    logger.error('Error processing request', error as Error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  } finally {
    await ratesService.destroy()
    logger.info('Database connection cleaned up')
  }
}

// Export the wrapped handler
export const handler = middy(baseHandler).use(injectLambdaContext(logger))
