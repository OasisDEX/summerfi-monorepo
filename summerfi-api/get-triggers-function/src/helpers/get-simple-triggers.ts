import { TriggersQuery } from '@summerfi/automation-subgraph'
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
  MakerStopLossToCollateralID,
  MakerStopLossToDaiID,
  MakerBasicBuyID,
  MakerBasicSellID,
  MakerStopLossToCollateral,
  MakerStopLossToDai,
  MakerBasicBuy,
  MakerBasicSell,
  MakerConstantMultiple,
} from '@summerfi/triggers-shared/contracts'
import { z } from 'zod'
import { paramsSchema } from '../constants'
import {
  getMorphoLambdaPriceConverted,
  mapBuySellCommonParams,
  mapStopLossParams,
  mapTriggerCommonParams,
  mapTriggersWithSamePoolId,
  mapMakerDecodedBasicBuyParams,
  mapMakerDecodedBasicSellParams,
  mapMakerDecodedStopLossParams,
} from '../helpers'
import { getTokensFromTrigger } from '../helpers/get-tokens-from-trigger'
import { filterTrigger } from './filter-trigger'
import { getMakerConstantMultiple } from './get-maker-constant-multiple'

export const getSimpleTriggers = ({
  triggers,
  params,
}: {
  triggers: TriggersQuery['triggers']
  params: z.infer<typeof paramsSchema>
}) => {
  const makerStopLossToCollateral: MakerStopLossToCollateral | undefined = triggers
    .filter(filterTrigger(MakerStopLossToCollateralID))
    .map((trigger) => {
      return {
        triggerTypeName: 'MakerStopLossToCollateral' as const,
        triggerType: MakerStopLossToCollateralID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapMakerDecodedStopLossParams(trigger),
      }
    })[0]

  const makerStopLossToDai: MakerStopLossToDai | undefined = triggers
    .filter(filterTrigger(MakerStopLossToDaiID))
    .map((trigger) => {
      return {
        triggerTypeName: 'MakerStopLossToDai' as const,
        triggerType: MakerStopLossToDaiID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapMakerDecodedStopLossParams(trigger),
      }
    })[0]

  const makerBasicBuy: MakerBasicBuy | undefined = triggers
    .filter(filterTrigger(MakerBasicBuyID))
    .map((trigger) => {
      return {
        triggerTypeName: 'MakerBasicBuy' as const,
        triggerType: MakerBasicBuyID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapMakerDecodedBasicBuyParams(trigger),
      }
    })[0]

  const makerBasicSell: MakerBasicSell | undefined = triggers
    .filter(filterTrigger(MakerBasicSellID))
    .map((trigger) => {
      return {
        triggerTypeName: 'MakerBasicSell' as const,
        triggerType: MakerBasicSellID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapMakerDecodedBasicSellParams(trigger),
      }
    })[0]

  const makerConstantMultiple: MakerConstantMultiple | undefined =
    makerBasicBuy && makerBasicSell
      ? getMakerConstantMultiple({
          makerBasicBuy,
          makerBasicSell,
          trigger: triggers.filter(filterTrigger(MakerBasicSellID))[0],
        })
      : undefined

  const aaveStopLossToCollateral: AaveStopLossToCollateral | undefined = triggers
    .filter(filterTrigger(AaveStopLossToCollateralV2ID))
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
    .filter(filterTrigger(AaveStopLossToDebtV2ID))
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
    .filter(filterTrigger(SparkStopLossToCollateralV2ID))
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
    .filter(filterTrigger(SparkStopLossToDebtV2ID))
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
    .filter(filterTrigger(DmaAaveBasicBuyV2ID))
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
    .filter(filterTrigger(DmaAaveBasicSellV2ID))
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
    .filter(filterTrigger(DmaSparkBasicBuyV2ID))
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
    .filter(filterTrigger(DmaSparkBasicSellV2ID))
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
    .filter(filterTrigger(MorphoBlueStopLossV2ID))
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
    .filter(filterTrigger(MorphoBlueBasicBuyV2ID))
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
    .filter(filterTrigger(MorphoBlueBasicSellV2ID))
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
    makerStopLossToCollateral,
    makerStopLossToDai,
    ...(makerConstantMultiple
      ? { makerConstantMultiple }
      : {
          makerBasicBuy,
          makerBasicSell,
        }),
  }
}
