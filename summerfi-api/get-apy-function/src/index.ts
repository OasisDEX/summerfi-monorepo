import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOk,
} from '@summerfi/serverless-shared/responses'
import { Logger } from '@aws-lambda-powertools/logger'
import {
  addressesSchema,
  addressSchema,
  ChainId,
  chainIdSchema,
  ltvSchema,
  ProtocolId,
  protocolIdSchema,
} from '@summerfi/serverless-shared'
import { z } from 'zod'
import { getMorphoBlueSubgraphClient } from '@summerfi/morpho-blue-subgraph'
import { getAjnaSubgraphClient } from '@summerfi/ajna-subgraph'
import { getAaveSparkSubgraphClient } from '@summerfi/aave-spark-subgraph'
import { getRedisInstance } from '@summerfi/redis-cache'
import { getCachableYieldService } from '@summerfi/defi-llama-client'
import { getTokenApyService } from './tokens-apy-service'
import { CalculatedRates, ProtocolResponse } from './protocols/types'
import {
  AaveSparkProtocolData,
  AjnaProtocolData,
  getAaveSparkRates,
  getAjnaRates,
  getMorphoBlueRates,
} from './protocols'
import * as process from 'node:process'
import { getFinalApy } from './final-apy-calculation'
import { DistributedCache } from '@summerfi/abstractions'

const logger = new Logger({ serviceName: 'get-apy-function' })

enum PositionMode {
  Supply = 'supply',
  Borrow = 'borrow',
}

const positionModeSchema = z
  .nativeEnum(PositionMode)
  .or(z.string())
  .refine((val) => z.nativeEnum(PositionMode).safeParse(val).success)
  .transform((val) => z.nativeEnum(PositionMode).parse(val))

const referenceDateSchema = z
  .date()
  .or(z.string().transform((val) => new Date(val)))
  .refine((val) => {
    return !isNaN(val.getTime())
  })

const aaveLikePositionSchema = z.object({
  collateral: addressesSchema,
  debt: addressesSchema,
  ltv: ltvSchema,
  referenceDate: referenceDateSchema,
})

const morphoBluePositionSchema = z.object({
  ltv: ltvSchema,
  marketId: z.custom<`0x${string}`>((val) => {
    if (typeof val !== 'string') {
      return false
    }
    const splitted = val.split('0x')
    if (splitted.length !== 2) {
      return false
    }
    const [, bytes] = splitted
    return bytes.length == 64
  }),
  mode: positionModeSchema,
  referenceDate: referenceDateSchema,
})

const ajnaPositionSchema = z.object({
  ltv: ltvSchema,
  poolAddress: addressSchema,
  mode: positionModeSchema,
  referenceDate: referenceDateSchema,
})

export const pathParamsSchema = z.object({
  chainId: chainIdSchema,
  protocol: protocolIdSchema,
})

type AaveLikePosition = z.infer<typeof aaveLikePositionSchema>
type MorphoBluePosition = z.infer<typeof morphoBluePositionSchema>
type AjnaPosition = z.infer<typeof ajnaPositionSchema>

type ApyResult = CalculatedRates & { apy: number }

interface ApyResponse {
  position: AaveLikePosition | MorphoBluePosition | AjnaPosition
  multiply: number
  positionData: unknown
  results: ApyResult
  breakdowns: {
    borrowCost: ApyResult
    supplyReward: ApyResult
    underlyingBorrowedTokenYield: ApyResult
    underlyingSuppliedTokenYield: ApyResult
  }
}

const getUnifiedProtocolRates = async (
  protocolId: ProtocolId,
  event: APIGatewayProxyEventV2,
  logger: Logger,
  cache: DistributedCache,
  subgraphsConfig: {
    urlBase: string
    chainId: ChainId
  },
): Promise<
  | { isValid: false; message: string }
  | {
      isValid: true
      protocolRates: ProtocolResponse<unknown>
      position: AaveLikePosition | MorphoBluePosition | AjnaPosition
    }
> => {
  if (
    protocolId === ProtocolId.AAVE3 ||
    protocolId === ProtocolId.AAVE_V2 ||
    protocolId === ProtocolId.AAVE_V3 ||
    protocolId === ProtocolId.SPARK
  ) {
    const parseResult = aaveLikePositionSchema.safeParse(event.queryStringParameters)
    if (!parseResult.success) {
      return { isValid: false, message: 'Invalid query parameters' }
    }

    const cacheKey = `${protocolId}-${subgraphsConfig.chainId}-${JSON.stringify(parseResult.data)}`

    const fromCache = await cache.get(cacheKey)

    if (fromCache) {
      const parsed = JSON.parse(fromCache) as ProtocolResponse<AaveSparkProtocolData>
      return { isValid: true, protocolRates: parsed, position: parseResult.data }
    }

    const rates = await getAaveSparkRates({
      collateralToken: parseResult.data.collateral[0],
      debtToken: parseResult.data.debt[0],
      protocol: protocolId,
      logger,
      timestamp: parseResult.data.referenceDate,
      subgraphClient: getAaveSparkSubgraphClient({ ...subgraphsConfig, logger }),
    })

    await cache.set(cacheKey, JSON.stringify(rates))

    return { isValid: true, protocolRates: rates, position: parseResult.data }
  }

  if (protocolId === ProtocolId.AJNA) {
    const parseResult = ajnaPositionSchema.safeParse(event.queryStringParameters)
    if (!parseResult.success) {
      return { isValid: false, message: 'Invalid query parameters' }
    }

    const cacheKey = `${protocolId}-${subgraphsConfig.chainId}-${JSON.stringify(parseResult.data)}`

    const fromCache = await cache.get(cacheKey)

    if (fromCache) {
      const parsed = JSON.parse(fromCache) as ProtocolResponse<AjnaProtocolData>
      return { isValid: true, protocolRates: parsed, position: parseResult.data }
    }

    const rates = await getAjnaRates({
      poolId: parseResult.data.poolAddress,
      logger,
      timestamp: parseResult.data.referenceDate,
      subgraphClient: getAjnaSubgraphClient({ ...subgraphsConfig, logger }),
    })

    await cache.set(cacheKey, JSON.stringify(rates))

    return { isValid: true, protocolRates: rates, position: parseResult.data }
  }

  if (protocolId === ProtocolId.MORPHO_BLUE) {
    const parseResult = morphoBluePositionSchema.safeParse(event.queryStringParameters)
    if (!parseResult.success) {
      return { isValid: false, message: 'Invalid query parameters' }
    }

    const cacheKey = `${protocolId}-${subgraphsConfig.chainId}-${JSON.stringify(parseResult.data)}`

    const fromCache = await cache.get(cacheKey)
    if (fromCache) {
      const parsed = JSON.parse(fromCache) as ProtocolResponse<AjnaProtocolData>
      return { isValid: true, protocolRates: parsed, position: parseResult.data }
    }

    const rates = await getMorphoBlueRates({
      marketId: parseResult.data.marketId,
      logger,
      timestamp: parseResult.data.referenceDate,
      subgraphClient: getMorphoBlueSubgraphClient({
        ...subgraphsConfig,
        logger,
        chainId: ChainId.MAINNET,
      }),
    })

    await cache.set(cacheKey, JSON.stringify(rates))

    return { isValid: true, protocolRates: rates, position: parseResult.data }
  }

  return { isValid: false, message: 'Unsupported protocol' }
}

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const RPC_GATEWAY = process.env.RPC_GATEWAY
  const SUBGRAPH_BASE = process.env.SUBGRAPH_BASE
  const REDIS_CACHE_URL = process.env.REDIS_CACHE_URL
  const REDIS_CACHE_USER = process.env.REDIS_CACHE_USER
  const REDIS_CACHE_PASSWORD = process.env.REDIS_CACHE_PASSWORD

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

  const sixHoursInSeconds = 6 * 60 * 60

  const cache = !REDIS_CACHE_URL
    ? ({
        get: async () => null,
        set: async () => {},
      } as DistributedCache)
    : await getRedisInstance(
        {
          url: REDIS_CACHE_URL,
          ttlInSeconds: sixHoursInSeconds,
          username: REDIS_CACHE_USER,
          password: REDIS_CACHE_PASSWORD,
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
    referenceDate: unifiedProtocolRates.position.referenceDate,
  })

  const borrowedTokenRates = await tokenApyService.getTokenApy({
    token: unifiedProtocolRates.protocolRates.tokens.borrowed,
    referenceDate: unifiedProtocolRates.position.referenceDate,
  })

  const { rates: finalApy, multiply } = getFinalApy({
    supplied: [suppliedTokenRates.rates, unifiedProtocolRates.protocolRates.supplyRates],
    borrowed: [borrowedTokenRates.rates, unifiedProtocolRates.protocolRates.borrowRates],
    ltv: unifiedProtocolRates.position.ltv,
  })

  const result: ApyResponse = {
    multiply,
    position: unifiedProtocolRates.position,
    positionData: unifiedProtocolRates.protocolRates.protocolData,
    results: {
      ...finalApy,
      apy: finalApy.apy365d,
    },
    breakdowns: {
      borrowCost: {
        ...unifiedProtocolRates.protocolRates.borrowRates,
        apy: unifiedProtocolRates.protocolRates.borrowRates.apy365d,
      },
      supplyReward: {
        ...unifiedProtocolRates.protocolRates.supplyRates,
        apy: unifiedProtocolRates.protocolRates.supplyRates.apy365d,
      },
      underlyingBorrowedTokenYield: {
        ...borrowedTokenRates.rates,
        apy: borrowedTokenRates.rates.apy365d,
      },
      underlyingSuppliedTokenYield: {
        ...suppliedTokenRates.rates,
        apy: suppliedTokenRates.rates.apy365d,
      },
    },
  }

  return ResponseOk({ body: result })
}

export default handler
