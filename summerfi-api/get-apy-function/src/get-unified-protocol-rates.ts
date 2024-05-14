import { ChainId, ProtocolId } from '@summerfi/serverless-shared'
import { DistributedCache } from '@summerfi/abstractions'
import { ProtocolResponse } from './protocols/types'
import {
  AaveSparkInterestRateResult,
  getAaveSparkSubgraphClient,
} from '@summerfi/aave-spark-subgraph'
import { getEndOfDayTimestamp, SecondTimestamp, ShortDate, yearsAgo } from './helpers'
import { getAaveSparkRates, getAjnaRates, getMorphoBlueRates } from './protocols'
import { AjnaPoolInterestRateResult, getAjnaSubgraphClient } from '@summerfi/ajna-subgraph'
import {
  getMorphoBlueSubgraphClient,
  MorphoBlueMarketInterestRateResult,
} from '@summerfi/morpho-blue-subgraph'
import { Logger } from '@aws-lambda-powertools/logger'
import { APIGatewayProxyEventV2 } from 'aws-lambda'
import {
  AaveLikePosition,
  aaveLikePositionSchema,
  AjnaPosition,
  ajnaPositionSchema,
  MorphoBluePosition,
  morphoBluePositionSchema,
} from './contracts'
import { saveSubgraphResponsesToCache } from './cache-helper'

const getTimestampsForRates = (referenceDate: ShortDate) => {
  const fromTimestamp = yearsAgo(referenceDate, 1)
  const toTimestamp = getEndOfDayTimestamp(referenceDate)
  return { fromTimestamp, toTimestamp }
}

export const getUnifiedProtocolRates = async (
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
      fromTimestamp: SecondTimestamp
      toTimestamp: SecondTimestamp
    }
> => {
  const chainId = subgraphsConfig.chainId
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

    const { fromTimestamp, toTimestamp } = getTimestampsForRates(parseResult.data.referenceDate)

    const cacheKeyCollateral = `${protocolId}-${subgraphsConfig.chainId}-t:${parseResult.data.collateral[0]}-from:${fromTimestamp}-to:${toTimestamp}`
    const cacheKeyDebt = `${protocolId}-${subgraphsConfig.chainId}-t:${parseResult.data.debt[0]}-from:${fromTimestamp}-to:${toTimestamp}`

    const fromCacheCollateral = await cache.get(cacheKeyCollateral)
    const fromCacheDebt = await cache.get(cacheKeyDebt)

    let subgraphResultCollateral: AaveSparkInterestRateResult | undefined
    let subgraphResultDebt: AaveSparkInterestRateResult | undefined

    const subgraphClient = getAaveSparkSubgraphClient({
      ...subgraphsConfig,
      logger,
      chainId,
    })

    if (fromCacheCollateral) {
      subgraphResultCollateral = JSON.parse(fromCacheCollateral) as AaveSparkInterestRateResult
    } else {
      subgraphResultCollateral = await subgraphClient.getInterestRate({
        token: parseResult.data.collateral[0],
        fromTimestamp,
        toTimestamp,
        protocol: protocolId,
      })

      await saveSubgraphResponsesToCache({
        subgraphResult: subgraphResultCollateral,
        protocolId,
        logger,
        cache,
        chainId,
        cacheKey: cacheKeyCollateral,
      })
    }

    if (fromCacheDebt) {
      subgraphResultDebt = JSON.parse(fromCacheDebt) as AaveSparkInterestRateResult
    } else {
      subgraphResultDebt = await subgraphClient.getInterestRate({
        token: parseResult.data.debt[0],
        fromTimestamp,
        toTimestamp,
        protocol: protocolId,
      })

      await saveSubgraphResponsesToCache({
        subgraphResult: subgraphResultDebt,
        protocolId,
        logger,
        cache,
        chainId,
        cacheKey: cacheKeyDebt,
      })
    }

    const rates = await getAaveSparkRates({
      collateralToken: parseResult.data.collateral[0],
      debtToken: parseResult.data.debt[0],
      protocol: protocolId,
      logger,
      timestamp: parseResult.data.referenceDate,
      aaveSubgraphSupplyRatesResponse: subgraphResultCollateral,
      aaveSubgraphBorrowRatesResponse: subgraphResultDebt,
    })

    return {
      isValid: true,
      protocolRates: rates,
      position: parseResult.data,
      fromTimestamp,
      toTimestamp,
    }
  }

  if (protocolId === ProtocolId.AJNA) {
    const parseResult = ajnaPositionSchema.safeParse(event.queryStringParameters)
    if (!parseResult.success) {
      return { isValid: false, message: 'Invalid query parameters' }
    }

    const { fromTimestamp, toTimestamp } = getTimestampsForRates(parseResult.data.referenceDate)

    const cacheKey = `${protocolId}-${subgraphsConfig.chainId}-p:${parseResult.data.poolAddress}-from:${fromTimestamp}-to:${toTimestamp}`

    const fromCache = await cache.get(cacheKey)

    let subgraphResult: AjnaPoolInterestRateResult | undefined = undefined
    if (fromCache) {
      subgraphResult = JSON.parse(fromCache) as AjnaPoolInterestRateResult
    } else {
      const subgraphClient = getAjnaSubgraphClient({
        ...subgraphsConfig,
        logger,
        chainId,
      })

      subgraphResult = await subgraphClient.getInterestRate({
        poolId: parseResult.data.poolAddress,
        fromTimestamp,
        toTimestamp,
      })

      await saveSubgraphResponsesToCache({
        subgraphResult,
        protocolId,
        logger,
        cache,
        chainId,
        cacheKey,
      })
    }

    const rates = await getAjnaRates({
      poolId: parseResult.data.poolAddress,
      logger,
      timestamp: parseResult.data.referenceDate,
      positionMode: parseResult.data.mode,
      ajnaSubgraphResponse: subgraphResult,
    })

    return {
      isValid: true,
      protocolRates: rates,
      position: parseResult.data,
      fromTimestamp,
      toTimestamp,
    }
  }

  if ([ProtocolId.MORPHO_BLUE_DEPRECATED, ProtocolId.MORPHO_BLUE].includes(protocolId)) {
    const parseResult = morphoBluePositionSchema.safeParse(event.queryStringParameters)
    if (!parseResult.success) {
      return { isValid: false, message: 'Invalid query parameters' }
    }

    const { fromTimestamp, toTimestamp } = getTimestampsForRates(parseResult.data.referenceDate)

    const cacheKey = `${protocolId}-${subgraphsConfig.chainId}-m:${parseResult.data.marketId}-from:${fromTimestamp}-to:${toTimestamp}`

    const fromCache = await cache.get(cacheKey)
    let subgraphResult: MorphoBlueMarketInterestRateResult | undefined
    if (fromCache) {
      subgraphResult = JSON.parse(fromCache) as MorphoBlueMarketInterestRateResult
    } else {
      const subgraphClient = getMorphoBlueSubgraphClient({
        ...subgraphsConfig,
        logger,
        chainId: ChainId.MAINNET,
      })

      subgraphResult = await subgraphClient.getInterestRate({
        marketId: parseResult.data.marketId,
        fromTimestamp,
        toTimestamp,
      })

      await saveSubgraphResponsesToCache({
        subgraphResult,
        protocolId,
        logger,
        cache,
        chainId,
        cacheKey,
      })
    }

    const rates = await getMorphoBlueRates({
      marketId: parseResult.data.marketId,
      logger,
      timestamp: parseResult.data.referenceDate,
      positionMode: parseResult.data.mode,
      morphoSubgraphResponse: subgraphResult,
    })

    return {
      isValid: true,
      protocolRates: rates,
      position: parseResult.data,
      fromTimestamp,
      toTimestamp,
    }
  }

  return { isValid: false, message: 'Unsupported protocol' }
}
