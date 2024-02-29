import { z } from 'zod'
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOk,
} from '@summerfi/serverless-shared/responses'
import {
  addressSchema,
  chainIdSchema,
  urlOptionalSchema,
} from '@summerfi/serverless-shared/validators'

import { getAutomationSubgraphClient } from '@summerfi/automation-subgraph'

import { Logger } from '@aws-lambda-powertools/logger'
import {
  AaveStopLossToCollateral,
  AaveStopLossToCollateralDMA,
  AaveStopLossToCollateralV2ID,
  AaveStopLossToDebt,
  AaveStopLossToDebtDMA,
  AaveStopLossToDebtV2ID,
  DmaAaveBasicBuy,
  DmaAaveBasicBuyV2ID,
  DmaAaveBasicSell,
  DmaAaveBasicSellV2ID,
  DmaAaveStopLossToCollateralV2ID,
  DmaAaveStopLossToDebtV2ID,
  DmaSparkBasicBuy,
  DmaSparkBasicBuyV2ID,
  DmaSparkBasicSell,
  DmaSparkBasicSellV2ID,
  DmaSparkStopLossToCollateralV2ID,
  DmaSparkStopLossToDebtV2ID,
  GetTriggersResponse,
  LegacyDmaAaveStopLossToCollateralV2ID,
  LegacyDmaAaveStopLossToDebtV2ID,
  LegacyDmaSparkStopLossToCollateralV2ID,
  LegacyDmaSparkStopLossToDebtV2ID,
  SparkStopLossToCollateral,
  SparkStopLossToCollateralDMA,
  SparkStopLossToCollateralV2ID,
  SparkStopLossToDebt,
  SparkStopLossToDebtDMA,
  SparkStopLossToDebtV2ID,
} from '@summerfi/serverless-contracts/get-triggers-response'
import {
  mapBuySellCommonParams,
  mapStopLossParams,
  mapTriggerCommonParams,
  hasAnyDefined,
  getCurrentTrigger,
} from './helpers'
import { getPricesSubgraphClient } from '@summerfi/prices-subgraph'
import {
  getDmaAavePartialTakeProfit,
  getDmaSparkPartialTakeProfit,
  getDmaAaveTrailingStopLoss,
  getDmaSparkTrailingStopLoss,
} from './trigger-parsers'

const logger = new Logger({ serviceName: 'getTriggersFunction' })

const paramsSchema = z.object({
  dpm: addressSchema,
  chainId: chainIdSchema,
  rpc: urlOptionalSchema,
})

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const SUBGRAPH_BASE = process.env.SUBGRAPH_BASE

  logger.addContext(context)

  if (!SUBGRAPH_BASE) {
    logger.error('SUBGRAPH_BASE is not set')
    return ResponseInternalServerError('SUBGRAPH_BASE is not set')
  }

  logger.info(`Query params`, { params: event.queryStringParameters })

  const parseResult = paramsSchema.safeParse(event.queryStringParameters)
  if (!parseResult.success) {
    logger.warn('Incorrect query params', {
      params: event.queryStringParameters,
      errors: parseResult.error.errors,
    })
    return ResponseBadRequest({
      message: 'Validation Errors',
      errors: parseResult.error.errors,
    })
  }
  const params = parseResult.data

  logger.appendKeys({
    chainId: params.chainId,
  })

  const automationSubgraphClient = getAutomationSubgraphClient({
    urlBase: SUBGRAPH_BASE,
    chainId: params.chainId,
    logger,
  })

  const pricesSubgraphClient = getPricesSubgraphClient({
    urlBase: SUBGRAPH_BASE,
    chainId: params.chainId,
    logger,
  })

  const triggers = await automationSubgraphClient.getTriggers(params)

  logger.info(`Got ${triggers.triggers.length} triggers`, {
    triggers: triggers.triggers,
    account: params.dpm,
  })

  const aaveStopLossToCollateral: AaveStopLossToCollateral | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == AaveStopLossToCollateralV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'AaveStopLossToCollateralV2' as const,
        triggerType: AaveStopLossToCollateralV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const aaveStopLossToCollateralDMA: AaveStopLossToCollateralDMA | undefined = triggers.triggers
    .filter(
      (trigger) =>
        trigger.triggerType == DmaAaveStopLossToCollateralV2ID ||
        trigger.triggerType == LegacyDmaAaveStopLossToCollateralV2ID,
    )
    .map((trigger) => {
      return {
        triggerTypeName: 'DmaAaveStopLossToCollateralV2' as const,
        triggerType: DmaAaveStopLossToCollateralV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const aaveStopLossToDebt: AaveStopLossToDebt | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == AaveStopLossToDebtV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'AaveStopLossToDebtV2' as const,
        triggerType: AaveStopLossToDebtV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const aaveStopLossToDebtDMA: AaveStopLossToDebtDMA | undefined = triggers.triggers
    .filter(
      (trigger) =>
        trigger.triggerType == DmaAaveStopLossToDebtV2ID ||
        trigger.triggerType == LegacyDmaAaveStopLossToDebtV2ID,
    )
    .map((trigger) => {
      return {
        triggerTypeName: 'DmaAaveStopLossToDebtV2' as const,
        triggerType: DmaAaveStopLossToDebtV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const sparkStopLossToCollateral: SparkStopLossToCollateral | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == SparkStopLossToCollateralV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'SparkStopLossToCollateralV2' as const,
        triggerType: SparkStopLossToCollateralV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const sparkStopLossToCollateralDMA: SparkStopLossToCollateralDMA | undefined = triggers.triggers
    .filter(
      (trigger) =>
        trigger.triggerType == DmaSparkStopLossToCollateralV2ID ||
        trigger.triggerType == LegacyDmaSparkStopLossToCollateralV2ID,
    )
    .map((trigger) => {
      return {
        triggerTypeName: 'DmaSparkStopLossToCollateralV2' as const,
        triggerType: DmaSparkStopLossToCollateralV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const sparkStopLossToDebt: SparkStopLossToDebt | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == SparkStopLossToDebtV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'SparkStopLossToDebtV2' as const,
        triggerType: SparkStopLossToDebtV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const sparkStopLossToDebtDMA: SparkStopLossToDebtDMA | undefined = triggers.triggers
    .filter(
      (trigger) =>
        trigger.triggerType == DmaSparkStopLossToDebtV2ID ||
        trigger.triggerType == LegacyDmaSparkStopLossToDebtV2ID,
    )
    .map((trigger) => {
      return {
        triggerTypeName: 'DmaSparkStopLossToDebtV2' as const,
        triggerType: DmaSparkStopLossToDebtV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const aaveBasicBuy: DmaAaveBasicBuy | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == DmaAaveBasicBuyV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'DmaAaveBasicBuyV2' as const,
        triggerType: DmaAaveBasicBuyV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: {
          maxBuyPrice: trigger.decodedData[trigger.decodedDataNames.indexOf('maxBuyPrice')],
          ...mapBuySellCommonParams(trigger),
        },
      }
    })[0]

  const aaveBasicSell: DmaAaveBasicSell | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == DmaAaveBasicSellV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'DmaAaveBasicSellV2' as const,
        triggerType: DmaAaveBasicSellV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: {
          minSellPrice: trigger.decodedData[trigger.decodedDataNames.indexOf('minSellPrice')],
          ...mapBuySellCommonParams(trigger),
        },
      }
    })[0]

  const sparkBasicBuy: DmaSparkBasicBuy | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == DmaSparkBasicBuyV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'DmaSparkBasicBuyV2' as const,
        triggerType: DmaSparkBasicBuyV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: {
          maxBuyPrice: trigger.decodedData[trigger.decodedDataNames.indexOf('maxBuyPrice')],
          ...mapBuySellCommonParams(trigger),
        },
      }
    })[0]

  const sparkBasicSell: DmaSparkBasicSell | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == DmaSparkBasicSellV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'DmaSparkBasicSellV2' as const,
        triggerType: DmaSparkBasicSellV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: {
          minSellPrice: trigger.decodedData[trigger.decodedDataNames.indexOf('minSellPrice')],
          ...mapBuySellCommonParams(trigger),
        },
      }
    })[0]

  const aaveTrailingStopLossDMA = await getDmaAaveTrailingStopLoss({
    triggers,
    pricesSubgraphClient,
    logger,
  })

  const sparkTrailingStopLossDMA = await getDmaSparkTrailingStopLoss({
    triggers,
    pricesSubgraphClient,
    logger,
  })

  const aavePartialTakeProfit = await getDmaAavePartialTakeProfit({ triggers, logger })
  const sparkPartialTakeProfit = await getDmaSparkPartialTakeProfit({ triggers, logger })

  const response: GetTriggersResponse = {
    triggers: {
      aaveStopLossToCollateral,
      aaveStopLossToCollateralDMA,
      aaveStopLossToDebt,
      aaveStopLossToDebtDMA,
      sparkStopLossToCollateral,
      sparkStopLossToCollateralDMA,
      sparkStopLossToDebt,
      sparkStopLossToDebtDMA,
      aaveBasicBuy,
      aaveBasicSell,
      aaveTrailingStopLossDMA,
      sparkBasicSell,
      sparkBasicBuy,
      sparkTrailingStopLossDMA,
      aavePartialTakeProfit,
      sparkPartialTakeProfit,
    },
    flags: {
      isAaveStopLossEnabled: hasAnyDefined(
        aaveStopLossToCollateral,
        aaveStopLossToCollateralDMA,
        aaveStopLossToDebt,
        aaveStopLossToDebtDMA,
        aaveTrailingStopLossDMA,
      ),
      isSparkStopLossEnabled: hasAnyDefined(
        sparkStopLossToCollateral,
        sparkStopLossToCollateralDMA,
        sparkStopLossToDebt,
        sparkStopLossToDebtDMA,
        sparkTrailingStopLossDMA,
      ),
      isAaveBasicBuyEnabled: hasAnyDefined(aaveBasicBuy),
      isAaveBasicSellEnabled: hasAnyDefined(aaveBasicSell),
      isSparkBasicBuyEnabled: hasAnyDefined(sparkBasicBuy),
      isSparkBasicSellEnabled: hasAnyDefined(sparkBasicSell),
      isAavePartialTakeProfitEnabled: hasAnyDefined(aavePartialTakeProfit),
      isSparkPartialTakeProfitEnabled: hasAnyDefined(sparkPartialTakeProfit),
    },
    triggersCount: triggers.triggers.length,
    triggerGroup: {
      aaveStopLoss: getCurrentTrigger(
        aaveStopLossToCollateral,
        aaveStopLossToCollateralDMA,
        aaveStopLossToDebt,
        aaveStopLossToDebtDMA,
        aaveTrailingStopLossDMA,
      ),
      sparkStopLoss: getCurrentTrigger(
        sparkStopLossToCollateral,
        sparkStopLossToCollateralDMA,
        sparkStopLossToDebt,
        sparkStopLossToDebtDMA,
        sparkTrailingStopLossDMA,
      ),
      aaveBasicBuy: getCurrentTrigger(aaveBasicBuy),
      aaveBasicSell: getCurrentTrigger(aaveBasicSell),
      sparkBasicBuy: getCurrentTrigger(sparkBasicBuy),
      sparkBasicSell: getCurrentTrigger(sparkBasicSell),
      aavePartialTakeProfit: getCurrentTrigger(aavePartialTakeProfit),
      sparkPartialTakeProfit: getCurrentTrigger(sparkPartialTakeProfit),
    },
    additionalData: {
      params: {
        ...params,
      },
    },
  }

  return ResponseOk({ body: response })
}

export default handler
