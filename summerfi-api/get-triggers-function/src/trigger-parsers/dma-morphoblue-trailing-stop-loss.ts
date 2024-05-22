import {
  MorphoBlueTrailingStopLossID,
  MorphoBlueTrailingStopLoss,
} from '@summerfi/triggers-shared/contracts'
import { PricesSubgraphClient } from '@summerfi/prices-subgraph'
import { TriggersQuery } from '@summerfi/automation-subgraph'
import { safeParseBigInt } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { mapTriggerCommonParams, mapTriggersWithSamePoolId } from '../helpers'

export const getDmaMorphoBlueTrailingStopLoss = async ({
  triggers,
  poolId,
  pricesSubgraphClient,
  logger,
}: {
  triggers: TriggersQuery
  poolId: string
  pricesSubgraphClient: PricesSubgraphClient
  logger: Logger
}): Promise<MorphoBlueTrailingStopLoss | undefined> => {
  const trigger = triggers.triggers.find(
    (trigger) =>
      trigger.triggerType == MorphoBlueTrailingStopLossID &&
      mapTriggersWithSamePoolId({ trigger, poolId }),
  )
  if (!trigger) {
    return undefined
  }
  const token = trigger.decodedData[
    trigger.decodedDataNames.indexOf('collateralToken')
  ] as `0x${string}`
  const tokenRoundId =
    safeParseBigInt(
      trigger.decodedData[trigger.decodedDataNames.indexOf('collateralAddedRoundId')],
    ) ?? 0n
  const denomination = trigger.decodedData[
    trigger.decodedDataNames.indexOf('debtToken')
  ] as `0x${string}`
  const denominationRoundId =
    safeParseBigInt(trigger.decodedData[trigger.decodedDataNames.indexOf('debtAddedRoundId')]) ?? 0n
  const creationTimestamp = trigger.addedTimestamp

  const maxPriceResponse = await pricesSubgraphClient.getMaxPrice({
    token,
    denomination,
    from: creationTimestamp,
  })

  const originalPriceResponse = await pricesSubgraphClient.getPriceByRoundIds({
    tokenRoundId,
    denominationRoundId,
  })

  const trailingDistance =
    safeParseBigInt(trigger.decodedData[trigger.decodedDataNames.indexOf('trailingDistance')]) ?? 0n
  let maxPrice = safeParseBigInt(maxPriceResponse?.derivedPrice.toString())
  let originalPrice = safeParseBigInt(originalPriceResponse?.derivedPrice.toString())

  if (!maxPrice) {
    logger.warn('Max price not found for', { token, denomination, creationTimestamp })
  }

  if (!originalPrice) {
    logger.warn('Original price not found for', {
      token,
      denomination,
      tokenRoundId,
      denominationRoundId,
    })
  }

  originalPrice = originalPrice ?? 0n

  if (!maxPrice) {
    maxPrice = originalPrice
  }

  if (maxPrice < originalPrice) {
    logger.warn('Max price is less than original price, using original price as execution price', {
      maxPrice,
      originalPrice,
    })
    maxPrice = originalPrice
  }

  const dynamicParams = {
    executionPrice: maxPrice - trailingDistance,
    originalPrice: originalPrice - trailingDistance,
  }

  return {
    triggerTypeName: 'MorphoBlueTrailingStopLoss' as const,
    triggerType: MorphoBlueTrailingStopLossID,
    ...mapTriggerCommonParams(trigger),
    decodedParams: {
      triggerType: trigger.decodedData[trigger.decodedDataNames.indexOf('triggerType')],
      positionAddress: trigger.decodedData[trigger.decodedDataNames.indexOf('positionAddress')],
      maxCoverage: trigger.decodedData[trigger.decodedDataNames.indexOf('maxCoverage')],
      debtToken: trigger.decodedData[trigger.decodedDataNames.indexOf('debtToken')],
      collateralToken: trigger.decodedData[trigger.decodedDataNames.indexOf('collateralToken')],
      operationName: trigger.decodedData[trigger.decodedDataNames.indexOf('operationName')],
      collateralOracle: trigger.decodedData[trigger.decodedDataNames.indexOf('collateralOracle')],
      collateralAddedRoundId:
        trigger.decodedData[trigger.decodedDataNames.indexOf('collateralAddedRoundId')],
      debtOracle: trigger.decodedData[trigger.decodedDataNames.indexOf('debtOracle')],
      debtAddedRoundId: trigger.decodedData[trigger.decodedDataNames.indexOf('debtAddedRoundId')],
      trailingDistance: trigger.decodedData[trigger.decodedDataNames.indexOf('trailingDistance')],
      closeToCollateral: trigger.decodedData[trigger.decodedDataNames.indexOf('closeToCollateral')],
    },
    dynamicParams: {
      executionPrice: (dynamicParams.executionPrice ?? dynamicParams.originalPrice)?.toString(),
      originalExecutionPrice: dynamicParams.originalPrice?.toString(),
    },
  }
}
