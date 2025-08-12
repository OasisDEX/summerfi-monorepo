import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { Logger } from '@aws-lambda-powertools/logger'
import { VaultRatesService, FleetWithChainId } from './db-service'
import { getRedisInstance } from '@summerfi/redis-cache'
import { DistributedCache } from '@summerfi/abstractions'

const logger = new Logger({ serviceName: 'get-vault-rates-function' })

interface VaultRatesRequest {
  fleets: FleetWithChainId[]
  first?: number
}

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const ratesService = new VaultRatesService()

  const REDIS_CACHE_URL = process.env.REDIS_CACHE_URL
  const REDIS_CACHE_USER = process.env.REDIS_CACHE_USER
  const REDIS_CACHE_PASSWORD = process.env.REDIS_CACHE_PASSWORD
  const STAGE = process.env.STAGE

  if (!REDIS_CACHE_URL) {
    logger.warn('REDIS_CACHE_URL is not set, the function will not use cache')
  }

  if (!STAGE) {
    logger.error('STAGE is not set')
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'STAGE is not set' }),
    }
  }

  const cache = !REDIS_CACHE_URL
    ? ({
        get: async () => null,
        set: async () => {},
      } as DistributedCache)
    : await getRedisInstance(
        {
          url: REDIS_CACHE_URL,
          ttlInSeconds: 60 * 2, // 2 minutes
          username: REDIS_CACHE_USER,
          password: REDIS_CACHE_PASSWORD,
          stage: STAGE,
        },
        logger,
      )

  try {
    await ratesService.init()

    const path = event.requestContext.http.path

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is required' }),
      }
    }

    const { fleets, first = 1 }: VaultRatesRequest = JSON.parse(event.body)

    if (!fleets || !Array.isArray(fleets) || fleets.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'fleets array is required' }),
      }
    }

    // Validate each fleet
    for (const fleet of fleets) {
      if (!fleet.chainId || !fleet.fleetAddress) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Each fleet must have chainId and fleetAddress' }),
        }
      }
    }

    logger.info('Request parameters', {
      pairsCount: fleets.length,
      first,
    })

    if (path.includes('/vault/rates')) {
      const rates = await ratesService.getLatestRates(fleets, first, cache)

      logger.info('Latest rates result', {
        resultCount: rates.length,
        requestedFleetsCount: fleets.length,
        requestedFirst: first,
      })

      return {
        statusCode: 200,
        body: JSON.stringify({ rates }),
      }
    } else if (path.includes('/vault/historicalRates')) {
      const rates = await ratesService.getHistoricalRates(fleets, cache)

      logger.info('Historical rates result', {
        chainsCount: Object.keys(rates).length,
        requestedFleetsCount: fleets.length,
      })

      return {
        statusCode: 200,
        body: JSON.stringify({ rates }),
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
