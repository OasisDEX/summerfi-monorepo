import { TriggersQuery } from '@summerfi/automation-subgraph'
import {
  AaveStopLossToCollateral,
  AaveStopLossToCollateralDMA,
  AaveStopLossToCollateralV2ID,
  AaveStopLossToDebt,
  AaveStopLossToDebtDMA,
  AaveStopLossToDebtV2ID,
  MakerStopLossToCollateralID,
  MakerStopLossToDaiID,
  MakerBasicBuyID,
  MakerBasicSellID,
  MakerAutoTakeProfitToCollateralID,
  MakerAutoTakeProfitToDaiID,
  MakerStopLossToCollateral,
  MakerStopLossToDai,
  MakerBasicBuy,
  MakerBasicSell,
  MakerAutoTakeProfitToCollateral,
  MakerAutoTakeProfitToDai,
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
  LegacyDmaAaveStopLossToCollateralV2ID,
  LegacyDmaAaveStopLossToDebtV2ID,
  LegacyDmaSparkStopLossToCollateralV2ID,
  LegacyDmaSparkStopLossToDebtV2ID,
  MorphoBlueBasicBuy,
  MorphoBlueBasicBuyV2ID,
  MorphoBlueBasicSell,
  MorphoBlueBasicSellV2ID,
  MorphoBlueStopLoss,
  MorphoBlueStopLossV2ID,
  SparkStopLossToCollateral,
  SparkStopLossToCollateralDMA,
  SparkStopLossToCollateralV2ID,
  SparkStopLossToDebt,
  SparkStopLossToDebtDMA,
  SparkStopLossToDebtV2ID,
} from '@summerfi/triggers-shared/contracts'
import { z } from 'zod'
import { paramsSchema } from '../constants'
import {
  getMorphoLambdaPriceConverted,
  mapBuySellCommonParams,
  mapMakerAutoTakeProfitParams,
  mapMakerBasicBuyParams,
  mapMakerBasicSellParams,
  mapMakerStopLossParams,
  mapStopLossParams,
  mapTriggerCommonParams,
  mapTriggersWithSamePoolId,
} from '../helpers'
import { getTokensFromTrigger } from '../helpers/get-tokens-from-trigger'

export const getSimpleTriggers = ({
  triggers,
  params,
}: {
  triggers: TriggersQuery['triggers']
  params: z.infer<typeof paramsSchema>
}) => {
  const makerStopLossToCollateral: MakerStopLossToCollateral | undefined = triggers
    .filter((trigger) => trigger.triggerType == MakerStopLossToCollateralID)
    .map((trigger) => {
      return {
        triggerTypeName: 'MakerStopLossToCollateral' as const,
        triggerType: MakerStopLossToCollateralID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapMakerStopLossParams(trigger),
      }
    })[0]
  const makerStopLossToDai: MakerStopLossToDai | undefined = triggers
    .filter((trigger) => trigger.triggerType == MakerStopLossToDaiID)
    .map((trigger) => {
      return {
        triggerTypeName: 'MakerStopLossToDai' as const,
        triggerType: MakerStopLossToDaiID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapMakerStopLossParams(trigger),
      }
    })[0]
  const makerBasicBuy: MakerBasicBuy | undefined = triggers
    .filter((trigger) => trigger.triggerType == MakerBasicBuyID)
    .map((trigger) => {
      console.log('trigger', trigger)
      return {
        triggerTypeName: 'MakerBasicBuy' as const,
        triggerType: MakerBasicBuyID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapMakerBasicBuyParams(trigger),
      }
    })[0]
  const makerBasicSell: MakerBasicSell | undefined = triggers
    .filter((trigger) => trigger.triggerType == MakerBasicSellID)
    .map((trigger) => {
      return {
        triggerTypeName: 'MakerBasicSell' as const,
        triggerType: MakerBasicSellID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapMakerBasicSellParams(trigger),
      }
    })[0]
  const makerAutoTakeProfitToCollateral: MakerAutoTakeProfitToCollateral | undefined = triggers
    .filter((trigger) => trigger.triggerType == MakerAutoTakeProfitToCollateralID)
    .map((trigger) => {
      return {
        triggerTypeName: 'MakerAutoTakeProfitToCollateral' as const,
        triggerType: MakerAutoTakeProfitToCollateralID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapMakerAutoTakeProfitParams(trigger),
      }
    })[0]
  const makerAutoTakeProfitToDai: MakerAutoTakeProfitToDai | undefined = triggers
    .filter((trigger) => trigger.triggerType == MakerAutoTakeProfitToDaiID)
    .map((trigger) => {
      return {
        triggerTypeName: 'MakerAutoTakeProfitToDai' as const,
        triggerType: MakerAutoTakeProfitToDaiID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapMakerAutoTakeProfitParams(trigger),
      }
    })[0]
  const aaveStopLossToCollateral: AaveStopLossToCollateral | undefined = triggers
    .filter((trigger) => trigger.triggerType == AaveStopLossToCollateralV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'AaveStopLossToCollateralV2' as const,
        triggerType: AaveStopLossToCollateralV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const aaveStopLossToCollateralDMA: AaveStopLossToCollateralDMA | undefined = triggers
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

  const aaveStopLossToDebt: AaveStopLossToDebt | undefined = triggers
    .filter((trigger) => trigger.triggerType == AaveStopLossToDebtV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'AaveStopLossToDebtV2' as const,
        triggerType: AaveStopLossToDebtV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const aaveStopLossToDebtDMA: AaveStopLossToDebtDMA | undefined = triggers
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

  const sparkStopLossToCollateral: SparkStopLossToCollateral | undefined = triggers
    .filter((trigger) => trigger.triggerType == SparkStopLossToCollateralV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'SparkStopLossToCollateralV2' as const,
        triggerType: SparkStopLossToCollateralV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const sparkStopLossToCollateralDMA: SparkStopLossToCollateralDMA | undefined = triggers
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

  const sparkStopLossToDebt: SparkStopLossToDebt | undefined = triggers
    .filter((trigger) => trigger.triggerType == SparkStopLossToDebtV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'SparkStopLossToDebtV2' as const,
        triggerType: SparkStopLossToDebtV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const sparkStopLossToDebtDMA: SparkStopLossToDebtDMA | undefined = triggers
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

  const aaveBasicBuy: DmaAaveBasicBuy | undefined = triggers
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

  const aaveBasicSell: DmaAaveBasicSell | undefined = triggers
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

  const sparkBasicBuy: DmaSparkBasicBuy | undefined = triggers
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

  const sparkBasicSell: DmaSparkBasicSell | undefined = triggers
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

  const morphoBlueStopLoss: MorphoBlueStopLoss | undefined = triggers
    .filter((trigger) => trigger.triggerType == MorphoBlueStopLossV2ID)
    .filter((trigger) => mapTriggersWithSamePoolId({ trigger, poolId: params.poolId }))
    .map((trigger) => {
      return {
        triggerTypeName: 'MorphoBlueStopLossV2' as const,
        triggerType: MorphoBlueStopLossV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const morphoBlueBasicBuy: MorphoBlueBasicBuy | undefined = triggers
    .filter((trigger) => trigger.triggerType == MorphoBlueBasicBuyV2ID)
    .filter((trigger) => mapTriggersWithSamePoolId({ trigger, poolId: params.poolId }))
    .map((trigger) => {
      const { collateralToken, debtToken } = getTokensFromTrigger(trigger)

      return {
        triggerTypeName: 'MorphoBlueBasicBuyV2' as const,
        triggerType: MorphoBlueBasicBuyV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: {
          maxBuyPrice: getMorphoLambdaPriceConverted({
            price: BigInt(trigger.decodedData[trigger.decodedDataNames.indexOf('maxBuyPrice')]),
            collateralDecimals: collateralToken.decimals,
            debtDecimals: debtToken.decimals,
          }).toString(),
          ...mapBuySellCommonParams(trigger),
        },
      }
    })[0]
  const morphoBlueBasicSell: MorphoBlueBasicSell | undefined = triggers
    .filter((trigger) => trigger.triggerType == MorphoBlueBasicSellV2ID)
    .filter((trigger) => mapTriggersWithSamePoolId({ trigger, poolId: params.poolId }))
    .map((trigger) => {
      const { collateralToken, debtToken } = getTokensFromTrigger(trigger)

      return {
        triggerTypeName: 'MorphoBlueBasicSellV2' as const,
        triggerType: MorphoBlueBasicSellV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: {
          minSellPrice: getMorphoLambdaPriceConverted({
            price: BigInt(trigger.decodedData[trigger.decodedDataNames.indexOf('minSellPrice')]),
            collateralDecimals: collateralToken.decimals,
            debtDecimals: debtToken.decimals,
          }).toString(),
          ...mapBuySellCommonParams(trigger),
        },
      }
    })[0]

  return {
    makerStopLossToCollateral,
    makerStopLossToDai,
    makerBasicBuy,
    makerBasicSell,
    makerAutoTakeProfitToCollateral,
    makerAutoTakeProfitToDai,
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
    sparkBasicBuy,
    sparkBasicSell,
    morphoBlueStopLoss,
    morphoBlueBasicBuy,
    morphoBlueBasicSell,
  }
}
