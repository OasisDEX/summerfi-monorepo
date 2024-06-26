import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOk,
} from '@summerfi/serverless-shared/responses'
import { Logger } from '@aws-lambda-powertools/logger'

import { getRedisInstance } from '@summerfi/redis-cache'
import { getCachableYieldService } from '@summerfi/defi-llama-client'
import { getTokenApyService } from './tokens-apy-service'
import * as process from 'node:process'
import { getFinalApy } from './final-apy-calculation'
import { DistributedCache } from '@summerfi/abstractions'
import { ONE_HOUR } from './helpers'
import { ApyResponse, pathParamsSchema } from './contracts'
import { getUnifiedProtocolRates } from './get-unified-protocol-rates'

const logger = new Logger({ serviceName: 'get-apy-function' })

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const RPC_GATEWAY = process.env.RPC_GATEWAY
  const SUBGRAPH_BASE = process.env.SUBGRAPH_BASE
  const REDIS_CACHE_URL = process.env.REDIS_CACHE_URL
  const REDIS_CACHE_USER = process.env.REDIS_CACHE_USER
  const REDIS_CACHE_PASSWORD = process.env.REDIS_CACHE_PASSWORD
  const STAGE = process.env.STAGE

  logger.addContext(context)
  if (!RPC_GATEWAY) {
    logger.error('RPC_GATEWAY is not set')
    return ResponseInternalServerError('RPC_GATEWAY is not set')
  }

  if (!SUBGRAPH_BASE) {
    logger.error('SUBGRAPH_BASE is not set')
    return ResponseInternalServerError('SUBGRAPH_BASE is not set')
  }

  if (!REDIS_CACHE_URL) {
    logger.warn('REDIS_CACHE_URL is not set, the function will not use cache')
  }

  if (!STAGE) {
    logger.error('STAGE is not set')
    return ResponseInternalServerError('STAGE is not set')
  }

  const cache = !REDIS_CACHE_URL
    ? ({
        get: async () => null,
        set: async () => {},
      } as DistributedCache)
    : await getRedisInstance(
        {
          url: REDIS_CACHE_URL,
          // Temporarily reduced to 20 min, standard value is 6h
          ttlInSeconds: ONE_HOUR / 3,
          username: REDIS_CACHE_USER,
          password: REDIS_CACHE_PASSWORD,
          stage: STAGE,
        },
        logger,
      )

  const defiLlamaClient = getCachableYieldService(cache, logger)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tokenApyService = getTokenApyService({ yieldService: defiLlamaClient, logger })

  logger.debug(`Query params`, { params: event.queryStringParameters })

  const path = pathParamsSchema.safeParse(event.pathParameters)

  if (!path.success) {
    logger.error('Invalid path parameters', { errors: path.error })
    return ResponseBadRequest({
      body: { message: 'Invalid path parameters', errors: path.error },
    })
  }

  const { protocol, chainId } = path.data

  const unifiedProtocolRates = await getUnifiedProtocolRates(protocol, event, logger, cache, {
    urlBase: SUBGRAPH_BASE,
    chainId,
  })

  if (!unifiedProtocolRates.isValid) {
    logger.error('Invalid query parameters', { message: unifiedProtocolRates.message })
    return ResponseBadRequest({ body: { message: unifiedProtocolRates.message } })
  }

  const suppliedTokenRates = await tokenApyService.getTokenApy({
    token: unifiedProtocolRates.protocolRates.tokens.supplied,
    fromTimestamp: unifiedProtocolRates.fromTimestamp,
    toTimestamp: unifiedProtocolRates.toTimestamp,
  })

  const borrowedTokenRates = await tokenApyService.getTokenApy({
    token: unifiedProtocolRates.protocolRates.tokens.borrowed,
    fromTimestamp: unifiedProtocolRates.fromTimestamp,
    toTimestamp: unifiedProtocolRates.toTimestamp,
  })

  const { rates: finalApy, multiply } = getFinalApy({
    supplied: [suppliedTokenRates.rates, unifiedProtocolRates.protocolRates.supplyRates],
    borrowed: [borrowedTokenRates.rates, unifiedProtocolRates.protocolRates.borrowRates],
    ltv: unifiedProtocolRates.position.ltv,
    to: unifiedProtocolRates.toTimestamp,
    from: unifiedProtocolRates.fromTimestamp,
  })

  const result: ApyResponse = {
    multiply,
    position: unifiedProtocolRates.position,
    positionData: unifiedProtocolRates.protocolRates.protocolData,
    results: {
      ...finalApy,
      apy: finalApy.apy365d,
    },
  }

  return ResponseOk({ body: result })
}

export default handler
