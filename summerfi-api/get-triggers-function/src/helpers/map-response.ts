import { TriggersQuery } from '@summerfi/automation-subgraph'
import { ProtocolId } from '@summerfi/serverless-shared'
import { GetTriggersResponse } from '@summerfi/triggers-shared/contracts'
import { z } from 'zod'
import { paramsSchema } from '../constants'
import { getAdvancedTriggers } from './get-advanced-triggers'
import { getCurrentTrigger } from './get-current-trigger'
import { getSimpleTriggers } from './get-simple-triggers'
import { hasAnyDefined } from './has-any-defined'

export const mapResponse = ({
  simpleTriggers,
  advancedTriggers,
  triggers,
  params,
}: {
  simpleTriggers: ReturnType<typeof getSimpleTriggers>
  advancedTriggers: Awaited<ReturnType<typeof getAdvancedTriggers>>
  triggers: TriggersQuery
  params: z.infer<typeof paramsSchema>
}) =>
  ({
    triggers: {
      ...simpleTriggers,
      ...advancedTriggers,
      [ProtocolId.MAKER]: {
        basicBuy: simpleTriggers.makerBasicBuy,
        basicSell: simpleTriggers.makerBasicSell,
        stopLossToCollateral: simpleTriggers.makerStopLossToCollateral,
        stopLossToDebt: simpleTriggers.makerStopLossToDai,
        autoTakeProfitToCollateral: advancedTriggers.makerAutoTakeProfitToCollateral,
        autoTakeProfitToDebt: advancedTriggers.makerAutoTakeProfitToDai,
        constantMultiple: simpleTriggers.makerConstantMultiple,
      },
      [ProtocolId.AAVE3]: {
        basicBuy: simpleTriggers.aaveBasicBuy,
        basicSell: simpleTriggers.aaveBasicSell,
        stopLossToCollateral: simpleTriggers.aaveStopLossToCollateral,
        stopLossToCollateralDMA: simpleTriggers.aaveStopLossToCollateralDMA,
        stopLossToDebt: simpleTriggers.aaveStopLossToDebt,
        stopLossToDebtDMA: simpleTriggers.aaveStopLossToDebtDMA,
        partialTakeProfit: advancedTriggers.aavePartialTakeProfit,
        trailingStopLossDMA: advancedTriggers.aaveTrailingStopLossDMA,
      },
      [ProtocolId.SPARK]: {
        basicBuy: simpleTriggers.sparkBasicBuy,
        basicSell: simpleTriggers.sparkBasicSell,
        partialTakeProfit: advancedTriggers.sparkPartialTakeProfit,
        stopLossToCollateral: simpleTriggers.sparkStopLossToCollateral,
        stopLossToCollateralDMA: simpleTriggers.sparkStopLossToCollateralDMA,
        stopLossToDebt: simpleTriggers.sparkStopLossToDebt,
        stopLossToDebtDMA: simpleTriggers.sparkStopLossToDebtDMA,
        trailingStopLossDMA: advancedTriggers.sparkTrailingStopLossDMA,
      },
      ...(params.poolId && {
        [`${ProtocolId.MORPHO_BLUE}-${params.poolId}`]: {
          basicBuy: simpleTriggers.morphoBlueBasicBuy,
          basicSell: simpleTriggers.morphoBlueBasicSell,
          partialTakeProfit: advancedTriggers.morphoBluePartialTakeProfit,
          stopLoss: simpleTriggers.morphoBlueStopLoss,
          trailingStopLoss: advancedTriggers.morphoBlueTrailingStopLoss,
        },
      }),
    },
    flags: {
      [ProtocolId.MAKER]: {
        isStopLossEnabled: hasAnyDefined(
          simpleTriggers.makerStopLossToCollateral,
          simpleTriggers.makerStopLossToDai,
        ),
        isBasicBuyEnabled: hasAnyDefined(simpleTriggers.makerBasicBuy),
        isBasicSellEnabled: hasAnyDefined(simpleTriggers.makerBasicSell),
        isAutoTakeProfitEnabled: hasAnyDefined(
          advancedTriggers.makerAutoTakeProfitToCollateral,
          advancedTriggers.makerAutoTakeProfitToCollateral,
        ),
        isConstantMultipleEnabled: hasAnyDefined(simpleTriggers.makerConstantMultiple),
      },
      [ProtocolId.AAVE3]: {
        isStopLossEnabled: hasAnyDefined(
          simpleTriggers.aaveStopLossToCollateral,
          simpleTriggers.aaveStopLossToCollateralDMA,
          simpleTriggers.aaveStopLossToDebt,
          simpleTriggers.aaveStopLossToDebtDMA,
        ),
        isBasicBuyEnabled: hasAnyDefined(simpleTriggers.aaveBasicBuy),
        isBasicSellEnabled: hasAnyDefined(simpleTriggers.aaveBasicSell),
        isPartialTakeProfitEnabled: hasAnyDefined(advancedTriggers.aavePartialTakeProfit),
        isTrailingStopLossEnabled: hasAnyDefined(advancedTriggers.aaveTrailingStopLossDMA),
      },
      [ProtocolId.SPARK]: {
        isStopLossEnabled: hasAnyDefined(
          simpleTriggers.sparkStopLossToCollateral,
          simpleTriggers.sparkStopLossToCollateralDMA,
          simpleTriggers.sparkStopLossToDebt,
          simpleTriggers.sparkStopLossToDebtDMA,
        ),
        isBasicBuyEnabled: hasAnyDefined(simpleTriggers.sparkBasicBuy),
        isBasicSellEnabled: hasAnyDefined(simpleTriggers.sparkBasicSell),
        isPartialTakeProfitEnabled: hasAnyDefined(advancedTriggers.sparkPartialTakeProfit),
        isTrailingStopLossEnabled: hasAnyDefined(advancedTriggers.sparkTrailingStopLossDMA),
      },
      ...(params.poolId && {
        [`${ProtocolId.MORPHO_BLUE}-${params.poolId}`]: {
          isStopLossEnabled: hasAnyDefined(simpleTriggers.morphoBlueStopLoss),
          isBasicBuyEnabled: hasAnyDefined(simpleTriggers.morphoBlueBasicBuy),
          isBasicSellEnabled: hasAnyDefined(simpleTriggers.morphoBlueBasicSell),
          isPartialTakeProfitEnabled: hasAnyDefined(advancedTriggers.morphoBluePartialTakeProfit),
          isTrailingStopLossEnabled: hasAnyDefined(advancedTriggers.morphoBlueTrailingStopLoss),
        },
      }),
      /* deprecated start */
      isMakerStopLossEnabled: hasAnyDefined(
        simpleTriggers.makerStopLossToCollateral,
        simpleTriggers.makerStopLossToDai,
      ),
      isMakerBasicBuyEnabled: hasAnyDefined(simpleTriggers.makerBasicBuy),
      isMakerBasicSellEnabled: hasAnyDefined(simpleTriggers.makerBasicSell),
      isMakerAutoTakeProfitEnabled: hasAnyDefined(
        advancedTriggers.makerAutoTakeProfitToCollateral,
        advancedTriggers.makerAutoTakeProfitToCollateral,
      ),
      isMakerConstantMultipleEnabled: hasAnyDefined(simpleTriggers.makerConstantMultiple),
      isAaveStopLossEnabled: hasAnyDefined(
        simpleTriggers.aaveStopLossToCollateral,
        simpleTriggers.aaveStopLossToCollateralDMA,
        simpleTriggers.aaveStopLossToDebt,
        simpleTriggers.aaveStopLossToDebtDMA,
        advancedTriggers.aaveTrailingStopLossDMA,
      ),
      isAaveBasicBuyEnabled: hasAnyDefined(simpleTriggers.aaveBasicBuy),
      isAaveBasicSellEnabled: hasAnyDefined(simpleTriggers.aaveBasicSell),
      isAavePartialTakeProfitEnabled: hasAnyDefined(advancedTriggers.aavePartialTakeProfit),
      isSparkStopLossEnabled: hasAnyDefined(
        simpleTriggers.sparkStopLossToCollateral,
        simpleTriggers.sparkStopLossToCollateralDMA,
        simpleTriggers.sparkStopLossToDebt,
        simpleTriggers.sparkStopLossToDebtDMA,
        advancedTriggers.sparkTrailingStopLossDMA,
      ),
      isSparkBasicBuyEnabled: hasAnyDefined(simpleTriggers.sparkBasicBuy),
      isSparkBasicSellEnabled: hasAnyDefined(simpleTriggers.sparkBasicSell),
      isSparkPartialTakeProfitEnabled: hasAnyDefined(advancedTriggers.sparkPartialTakeProfit),
      /* deprecated end */
    },
    triggersCount: triggers.triggers.length,
    triggerGroup: {
      makerStopLoss: getCurrentTrigger(
        simpleTriggers.makerStopLossToCollateral,
        simpleTriggers.makerStopLossToDai,
      ),
      makerBasicBuy: getCurrentTrigger(simpleTriggers.makerBasicBuy),
      makerBasicSell: getCurrentTrigger(simpleTriggers.makerBasicSell),
      makerAutoTakeProfit: getCurrentTrigger(
        advancedTriggers.makerAutoTakeProfitToCollateral,
        advancedTriggers.makerAutoTakeProfitToCollateral,
      ),
      makerConstantMultiple: getCurrentTrigger(simpleTriggers.makerConstantMultiple),
      aaveBasicBuy: getCurrentTrigger(simpleTriggers.aaveBasicBuy),
      aaveBasicSell: getCurrentTrigger(simpleTriggers.aaveBasicSell),
      aavePartialTakeProfit: getCurrentTrigger(advancedTriggers.aavePartialTakeProfit),
      aaveStopLoss: advancedTriggers.aaveStopLoss,
      sparkBasicBuy: getCurrentTrigger(simpleTriggers.sparkBasicBuy),
      sparkBasicSell: getCurrentTrigger(simpleTriggers.sparkBasicSell),
      sparkPartialTakeProfit: getCurrentTrigger(advancedTriggers.sparkPartialTakeProfit),
      sparkStopLoss: advancedTriggers.sparkStopLoss,
      morphoBlueBasicBuy: getCurrentTrigger(simpleTriggers.morphoBlueBasicBuy),
      morphoBlueBasicSell: getCurrentTrigger(simpleTriggers.morphoBlueBasicSell),
      morphoBluePartialTakeProfit: getCurrentTrigger(advancedTriggers.morphoBluePartialTakeProfit),
      morphoBlueStopLoss: getCurrentTrigger(
        simpleTriggers.morphoBlueStopLoss,
        advancedTriggers.morphoBlueTrailingStopLoss,
      ),
    },
    additionalData: {
      params: {
        ...params,
      },
    },
  }) as GetTriggersResponse
