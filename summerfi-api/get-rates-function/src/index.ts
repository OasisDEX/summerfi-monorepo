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

const HOUR_IN_SECONDS = 60 * 60

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
      const errorMessage = error instanceof Error ? error.message : String(error)

      logger.debug('Caught error in retrySubgraphQuery', {
        errorMessage,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        includes429: errorMessage.includes('429'),
        currentRetry,
        ...context,
      })

      const isRateLimitError = errorMessage.includes('429')

      if (currentRetry === 1 || !isRateLimitError) {
        logger.error(`Error in ${context.operation}:`, {
          ...context,
          error: error instanceof Error ? error : String(error),
          currentRetry,
          isRateLimitError,
        })
        throw error
      }

      currentRetry--

      // Add random jitter between -25% and +25% of the delay
      const jitter = (delay * (0.5 - Math.random())) / 2
      const finalDelay = Math.max(delay + jitter, 100) // Ensure minimum 100ms delay

      logger.info(`Rate limited, retrying ${context.operation}...`, {
        ...context,
        retriesLeft: currentRetry,
        baseDelay: delay,
        actualDelay: finalDelay,
        jitterMs: jitter,
        errorMessage,
      })

      await new Promise((resolve) => setTimeout(resolve, finalDelay))
      delay *= 2 // Exponential backoff for next iteration
    }
  }

  throw new Error(`Failed to complete ${context.operation} after all retries`)
}

function findMatchingDbRate(subgraphTimestamp: number, dbRates: DBRate[]) {
  return dbRates.find((dbRate) => {
    const timeDiff = Number(subgraphTimestamp) - dbRate.timestamp
    return timeDiff >= 0 && timeDiff <= HOUR_IN_SECONDS
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

interface RatesRequest {
  productIds: string[]
}

interface CombinedRate {
  timestamp: string
  rate: string
  nativeRate: string
  rewardRate: string
  [key: string]: unknown
}

interface BatchRateRequest {
  chainId: string
  productId: string
}

async function baseHandler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const ratesService = new RatesService()

  try {
    logger.info('Initializing rates service')
    await ratesService.init()

    const path = event.requestContext.http.path
    const httpMethod = event.requestContext.http.method

    if (httpMethod === 'POST' && path === '/api/rates') {
      logger.info('POST /rates')
      if (!event.body) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Request body is required' }),
        }
      }

      const requestBody: RatesRequest = JSON.parse(event.body)
      const { productIds } = requestBody

      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'productIds array is required in the request body' }),
        }
      }

      // Group product IDs by chain ID
      const productIdsByChain: Record<string, string[]> = {}
      const batchRequests: BatchRateRequest[] = []

      for (const productId of productIds) {
        const chainId = productId.split('-').pop()
        if (!chainId) {
          logger.warn(`Invalid productId ${productId}. Skipping.`)
          continue
        }

        if (!productIdsByChain[chainId]) {
          productIdsByChain[chainId] = []
        }
        productIdsByChain[chainId].push(productId)

        // Build batch request array
        batchRequests.push({ chainId, productId })
      }

      logger.info('Grouped productIds by chain', { productIdsByChain })

      let allCombinedRates: { [productId: string]: CombinedRate[] } = {}

      // Fetch all DB rates in one batch query
      const dbRatesByProductId = await ratesService.getLatestRatesBatch(batchRequests)

      // Fetch and combine rates for each chain
      await Promise.all(
        Object.entries(productIdsByChain).map(async ([chainId, chainProductIds]) => {
          const client = clients[chainId]
          if (!client) {
            logger.warn(`No client found for chainId ${chainId}. Skipping.`)
            return
          }

          // Use batch query for subgraph
          const subgraphRates = await retrySubgraphQuery(
            () => client.GetArksRates({ productIds: chainProductIds }),
            {
              retries: 3,
              initialDelay: 1000,
              logger: logger,
              context: {
                operation: 'GetArkRates',
                productIds: chainProductIds,
                chainId: chainId,
              },
            },
          )

          // Process rates for each product
          chainProductIds.forEach((productId) => {
            const productRates =
              subgraphRates?.products.find((product) => product.id === productId)?.interestRates ||
              []
            const dbRates = dbRatesByProductId[productId] || []

            const combinedRates: CombinedRate[] = productRates
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

            allCombinedRates[productId] = combinedRates
          })
        }),
      )

      return {
        statusCode: 200,
        body: JSON.stringify({ interestRates: allCombinedRates }),
      }
    }

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
      const combinedRates: CombinedRate[] = (subgraphRates?.interestRates || [])
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
