import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { Logger } from '@aws-lambda-powertools/logger'
import { VaultRatesService, FleetWithChainId } from './db-service'
import { getRedisInstance } from '@summerfi/redis-cache'
import { DistributedCache } from '@summerfi/abstractions'
import { createHash } from 'crypto'

const logger = new Logger({ serviceName: 'get-vault-rates-function' })

interface VaultRatesRequest {
  fleets: FleetWithChainId[]
  first?: number
}

const generateCacheKey = ({
  prefix,
  fleets,
  first,
}: {
  prefix: string
  fleets: FleetWithChainId[]
  first: number
}) => {
  const sortedFleets = [...fleets].sort((a, b) => {
    if (a.chainId !== b.chainId) return Number(a.chainId) - Number(b.chainId)
    return a.fleetAddress.localeCompare(b.fleetAddress)
  })
  const data = JSON.stringify({ fleets: sortedFleets, first })
  const hash = createHash('sha256').update(data).digest('hex')
  return `${prefix}-${hash}`
}

let cachedDistributedCache: DistributedCache | null | undefined = undefined
async function getCacheInstance(): Promise<DistributedCache> {
  if (cachedDistributedCache && cachedDistributedCache !== undefined) {
    return cachedDistributedCache
  }
  const REDIS_CACHE_URL = process.env.REDIS_CACHE_URL
  const REDIS_CACHE_USER = process.env.REDIS_CACHE_USER
  const REDIS_CACHE_PASSWORD = process.env.REDIS_CACHE_PASSWORD
  const STAGE = process.env.STAGE

  if (!REDIS_CACHE_URL || !STAGE) {
    logger.warn('Redis not configured, using noop cache')
    cachedDistributedCache = {
      get: async () => null,
      set: async () => {},
    } as DistributedCache
    return cachedDistributedCache
  }

  cachedDistributedCache = await getRedisInstance(
    {
      url: REDIS_CACHE_URL,
      ttlInSeconds: 60 * 2,
      username: REDIS_CACHE_USER,
      password: REDIS_CACHE_PASSWORD,
      stage: STAGE,
    },
    logger,
  )
  return cachedDistributedCache
}

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const ratesService = new VaultRatesService()

  const REDIS_CACHE_URL = process.env.REDIS_CACHE_URL
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

  try {
    const withCacheRaw = event.queryStringParameters?.withCache
    const withCache = withCacheRaw === 'true'
    const hasCacheSettings = REDIS_CACHE_URL && STAGE
    if (withCache && !hasCacheSettings) {
      logger.warn(
        'Cache is requested via withCache=true but REDIS_CACHE_URL or STAGE is not set, proceeding without cache',
      )
    }

    const cache = await getCacheInstance()
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
      const cacheKey = generateCacheKey({
        prefix: 'vault-rates',
        fleets,
        first,
      })

      if (withCache) {
        const cached = await cache.get(cacheKey)

        if (cached) {
          logger.info('Returning cached vault-rates', { cacheKey })
          return {
            statusCode: 200,
            body: cached,
          }
        }
      }

      await ratesService.init()
      const rates = await ratesService.getLatestRates(fleets, first)

      logger.info('Latest rates result', {
        resultCount: rates.length,
        requestedFleetsCount: fleets.length,
        requestedFirst: first,
      })

      const responseBody = JSON.stringify({ rates })
      await cache.set(cacheKey, responseBody)

      return {
        statusCode: 200,
        body: responseBody,
      }
    } else if (path.includes('/vault/historicalRates')) {
      await ratesService.init()
      const rates = await ratesService.getHistoricalRates(fleets)

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
