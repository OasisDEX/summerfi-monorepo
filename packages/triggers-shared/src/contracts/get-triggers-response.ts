import { ProtocolId } from '@summerfi/serverless-shared'
import { Price, TokenBalance } from '../types'

// maker legacy ids
export const MakerStopLossToCollateralID = 1n as const
export const MakerStopLossToDaiID = 2n as const
export const MakerBasicBuyID = 3n as const
export const MakerBasicSellID = 4n as const
export const MakerAutoTakeProfitToCollateralID = 7n as const
export const MakerAutoTakeProfitToDaiID = 8n as const

// maker legacy ids that were supposed to happen but never did
// export const MakerStopLossToCollateralV2ID = 101n as const
// export const MakerStopLossToDaiV2ID = 102n as const
// export const MakerBasicBuyV2ID = 103n as const
// export const MakerBasicSellV2ID = 104n as const
// export const MakerAutoTakeProfitToCollateralV2ID = 105n as const
// export const MakerAutoTakeProfitToDaiV2ID = 106n as const

export const AaveStopLossToCollateralV2ID = 111n as const
export const AaveStopLossToDebtV2ID = 112n as const
export const SparkStopLossToCollateralV2ID = 117n as const
export const SparkStopLossToDebtV2ID = 118n as const

export const LegacyDmaAaveStopLossToCollateralV2ID = 123n as const
export const LegacyDmaAaveStopLossToDebtV2ID = 124n as const
export const LegacyDmaSparkStopLossToCollateralV2ID = 125n as const
export const LegacyDmaSparkStopLossToDebtV2ID = 126n as const

export const DmaAaveStopLossToCollateralV2ID = 127n as const
export const DmaAaveStopLossToDebtV2ID = 128n as const
export const DmaSparkStopLossToCollateralV2ID = 129n as const
export const DmaSparkStopLossToDebtV2ID = 130n as const

export const DmaAaveBasicBuyV2ID = 121n as const
export const DmaAaveBasicSellV2ID = 122n as const

export const DmaSparkBasicBuyV2ID = 131n as const
export const DmaSparkBasicSellV2ID = 132n as const

export const DmaAavePartialTakeProfitID = 133n as const
export const DmaSparkPartialTakeProfitID = 134n as const

export const DmaAaveTrailingStopLossID = 10006n as const
export const DmaSparkTrailingStopLossID = 10007n as const

export const MorphoBlueBasicBuyV2ID = 139n as const
export const MorphoBlueBasicSellV2ID = 140n as const
export const MorphoBluePartialTakeProfitID = 141n as const
export const MorphoBlueTrailingStopLossID = 10009n as const
export const MorphoBlueStopLossV2ID = 142n as const

export type Trigger = {
  triggerId: string
  triggerData: string
  triggerType: bigint
  decodedParams: unknown
  dynamicParams?: unknown
}

export type MakerStopLossToCollateral = Trigger & {
  triggerTypeName: 'MakerStopLossToCollateral'
  triggerType: typeof MakerStopLossToCollateralID
  decodedParams: {
    cdpId: string
    collRatio: string
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    executionLtv: string
    ltv?: string
  }
}
export type MakerStopLossToDai = Trigger & {
  triggerTypeName: 'MakerStopLossToDai'
  triggerType: typeof MakerStopLossToDaiID
  decodedParams: {
    cdpId: string
    collRatio: string
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    executionLtv: string
    ltv?: string
  }
}
export type MakerBasicBuy = Trigger & {
  triggerTypeName: 'MakerBasicBuy'
  triggerType: typeof MakerBasicBuyID
  decodedParams: {
    cdpId: string
    triggerType: string
    executionLtv: string
    targetLtv: string
    maxBuyPrice: string
    continuous: boolean
    deviation: string
    maxBaseFeeInGwei: string
  }
}

export type MakerBasicSell = Trigger & {
  triggerTypeName: 'MakerBasicSell'
  triggerType: typeof MakerBasicSellID
  decodedParams: {
    cdpId: string
    triggerType: string
    executionLtv: string
    targetLtv: string
    minSellPrice: string
    continuous: boolean
    deviation: string
    maxBaseFeeInGwei: string
  }
}

export type MakerAutoTakeProfitToCollateral = Trigger & {
  triggerTypeName: 'MakerAutoTakeProfitToCollateral'
  triggerType: typeof MakerAutoTakeProfitToCollateralID
  decodedParams: {
    cdpId: string
    triggerType: string
    executionPrice: string
    maxBaseFeeInGwei: string
  }
}
export type MakerAutoTakeProfitToDebt = Trigger & {
  triggerTypeName: 'MakerAutoTakeProfitToDai'
  triggerType: typeof MakerAutoTakeProfitToDaiID
  decodedParams: {
    cdpId: string
    triggerType: string
    executionPrice: string
    maxBaseFeeInGwei: string
  }
}
export type AaveStopLossToCollateral = Trigger & {
  triggerTypeName: 'AaveStopLossToCollateralV2'
  triggerType: typeof AaveStopLossToCollateralV2ID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    executionLtv: string
    ltv: string
  }
}
export type AaveStopLossToDebt = Trigger & {
  triggerTypeName: 'AaveStopLossToDebtV2'
  triggerType: typeof AaveStopLossToDebtV2ID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    executionLtv: string
    ltv: string
  }
}
export type SparkStopLossToCollateral = Trigger & {
  triggerTypeName: 'SparkStopLossToCollateralV2'
  triggerType: typeof SparkStopLossToCollateralV2ID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    executionLtv: string
    ltv: string
  }
}
export type SparkStopLossToDebt = Trigger & {
  triggerTypeName: 'SparkStopLossToDebtV2'
  triggerType: typeof SparkStopLossToDebtV2ID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    executionLtv: string
    ltv: string
  }
}
export type AaveStopLossToCollateralDMA = Trigger & {
  triggerTypeName: 'DmaAaveStopLossToCollateralV2'
  triggerType: typeof DmaAaveStopLossToCollateralV2ID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    executionLtv: string
    operationName: string
  }
}

export type AaveStopLossToDebtDMA = Trigger & {
  triggerTypeName: 'DmaAaveStopLossToDebtV2'
  triggerType: typeof DmaAaveStopLossToDebtV2ID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    executionLtv: string
    operationName: string
  }
}
export type SparkStopLossToCollateralDMA = Trigger & {
  triggerTypeName: 'DmaSparkStopLossToCollateralV2'
  triggerType: typeof DmaSparkStopLossToCollateralV2ID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    executionLtv: string
    operationName: string
  }
}
export type SparkStopLossToDebtDMA = Trigger & {
  triggerTypeName: 'DmaSparkStopLossToDebtV2'
  triggerType: typeof DmaSparkStopLossToDebtV2ID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    executionLtv: string
    operationName: string
  }
}

export type DmaAaveBasicBuy = Trigger & {
  triggerTypeName: 'DmaAaveBasicBuyV2'
  triggerType: typeof DmaAaveBasicBuyV2ID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    operationName: string
    executionLtv: string
    targetLtv: string
    maxBuyPrice: string
    deviation: string
    maxBaseFeeInGwei: string
  }
}
export type DmaAaveBasicSell = Trigger & {
  triggerTypeName: 'DmaAaveBasicSellV2'
  triggerType: typeof DmaAaveBasicSellV2ID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    operationName: string
    executionLtv: string
    targetLtv: string
    minSellPrice: string
    deviation: string
    maxBaseFeeInGwei: string
  }
}

export type DmaSparkBasicBuy = Trigger & {
  triggerTypeName: 'DmaSparkBasicBuyV2'
  triggerType: typeof DmaSparkBasicBuyV2ID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    operationName: string
    executionLtv: string
    targetLtv: string
    maxBuyPrice: string
    deviation: string
    maxBaseFeeInGwei: string
  }
}
export type DmaSparkBasicSell = Trigger & {
  triggerTypeName: 'DmaSparkBasicSellV2'
  triggerType: typeof DmaSparkBasicSellV2ID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    operationName: string
    executionLtv: string
    targetLtv: string
    minSellPrice: string
    deviation: string
    maxBaseFeeInGwei: string
  }
}

export type DmaAaveTrailingStopLoss = Trigger & {
  triggerTypeName: 'DmaAaveTrailingStopLoss'
  triggerType: typeof DmaAaveTrailingStopLossID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    operationName: string
    collateralOracle: string
    collateralAddedRoundId: string
    debtOracle: string
    debtAddedRoundId: string
    trailingDistance: string
    closeToCollateral: string
  }
  dynamicParams: {
    executionPrice?: string
    originalExecutionPrice?: string
  }
}

export type DmaSparkTrailingStopLoss = Trigger & {
  triggerTypeName: 'DmaSparkTrailingStopLoss'
  triggerType: typeof DmaSparkTrailingStopLossID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    operationName: string
    collateralOracle: string
    collateralAddedRoundId: string
    debtOracle: string
    debtAddedRoundId: string
    trailingDistance: string
    closeToCollateral: string
  }
  dynamicParams: {
    executionPrice?: string
    originalExecutionPrice?: string
  }
}

export type DmaAavePartialTakeProfit = Trigger & {
  triggerTypeName: 'DmaAavePartialTakeProfit'
  triggerType: typeof DmaAavePartialTakeProfitID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    operationName: string
    executionLtv: string
    targetLtv: string
    executionPrice: string
    deviation: string
    withdrawToDebt: string
  }
  dynamicParams?: {
    nextProfit: {
      triggerPrice: Price
      realizedProfitInCollateral: TokenBalance
      realizedProfitInDebt: TokenBalance
      totalProfitInCollateral: TokenBalance
      totalProfitInDebt: TokenBalance
      stopLossDynamicPrice?: Price
      fee: TokenBalance
      totalFee: TokenBalance
    }
  }
}

export type DmaSparkPartialTakeProfit = Trigger & {
  triggerTypeName: 'DmaAavePartialTakeProfit'
  triggerType: typeof DmaSparkPartialTakeProfitID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    operationName: string
    executionLtv: string
    targetLtv: string
    executionPrice: string
    deviation: string
    withdrawToDebt: string
  }
  dynamicParams?: {
    nextProfit: {
      triggerPrice: Price
      realizedProfitInCollateral: TokenBalance
      realizedProfitInDebt: TokenBalance
      totalProfitInCollateral: TokenBalance
      totalProfitInDebt: TokenBalance
      stopLossDynamicPrice?: Price
      fee: TokenBalance
      totalFee: TokenBalance
    }
  }
}

export type MorphoBlueBasicBuy = Trigger & {
  triggerTypeName: 'MorphoBlueBasicBuyV2'
  triggerType: typeof MorphoBlueBasicBuyV2ID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    operationName: string
    executionLtv: string
    targetLtv: string
    maxBuyPrice: string
    deviation: string
    maxBaseFeeInGwei: string
  }
}

export type MorphoBlueBasicSell = Trigger & {
  triggerTypeName: 'MorphoBlueBasicSellV2'
  triggerType: typeof MorphoBlueBasicSellV2ID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    operationName: string
    executionLtv: string
    targetLtv: string
    minSellPrice: string
    deviation: string
    maxBaseFeeInGwei: string
  }
}

export type MorphoBluePartialTakeProfit = Trigger & {
  triggerTypeName: 'MorphoBluePartialTakeProfit'
  triggerType: typeof MorphoBluePartialTakeProfitID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    operationName: string
    executionLtv: string
    targetLtv: string
    executionPrice: string
    deviation: string
    withdrawToDebt: string
  }
  dynamicParams?: {
    nextProfit: {
      triggerPrice: Price
      realizedProfitInCollateral: TokenBalance
      realizedProfitInDebt: TokenBalance
      totalProfitInCollateral: TokenBalance
      totalProfitInDebt: TokenBalance
      stopLossDynamicPrice?: Price
      fee: TokenBalance
      totalFee: TokenBalance
    }
  }
}

export type MorphoBlueTrailingStopLoss = Trigger & {
  triggerTypeName: 'MorphoBlueTrailingStopLoss'
  triggerType: typeof MorphoBlueTrailingStopLossID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    operationName: string
    collateralOracle: string
    collateralAddedRoundId: string
    debtOracle: string
    debtAddedRoundId: string
    trailingDistance: string
    closeToCollateral: string
  }
  dynamicParams: {
    executionPrice?: string
    originalExecutionPrice?: string
  }
}

export type MorphoBlueStopLoss = Trigger & {
  triggerTypeName: 'MorphoBlueStopLossV2'
  triggerType: typeof MorphoBlueStopLossV2ID
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    executionLtv: string
    ltv: string
  }
}

export type GetTriggersResponse = {
  triggers: {
    [ProtocolId.MAKER]: {
      basicBuy?: MakerBasicBuy
      basicSell?: MakerBasicSell
      stopLossToCollateral?: MakerStopLossToCollateral
      stopLossToDebt?: MakerStopLossToDai
      autoTakeProfitToCollateral?: MakerAutoTakeProfitToCollateral
      autoTakeProfitToDebt?: MakerAutoTakeProfitToDebt
    }
    [ProtocolId.AAVE3]: {
      basicBuy?: DmaAaveBasicBuy
      basicSell?: DmaAaveBasicSell
      partialTakeProfit?: DmaAavePartialTakeProfit
      stopLossToCollateral?: AaveStopLossToCollateral
      stopLossToCollateralDMA?: AaveStopLossToCollateralDMA
      stopLossToDebt?: AaveStopLossToDebt
      stopLossToDebtDMA?: AaveStopLossToDebtDMA
      trailingStopLossDMA?: DmaAaveTrailingStopLoss
    }
    [ProtocolId.SPARK]: {
      basicBuy?: DmaSparkBasicBuy
      basicSell?: DmaSparkBasicSell
      partialTakeProfit?: DmaSparkPartialTakeProfit
      stopLossToCollateral?: SparkStopLossToCollateral
      stopLossToCollateralDMA?: SparkStopLossToCollateralDMA
      stopLossToDebt?: SparkStopLossToDebt
      stopLossToDebtDMA?: SparkStopLossToDebtDMA
      trailingStopLossDMA?: DmaSparkTrailingStopLoss
    }
    [key: `${ProtocolId.MORPHO_BLUE}-0x${string}`]: {
      basicBuy?: MorphoBlueBasicBuy
      basicSell?: MorphoBlueBasicSell
      partialTakeProfit?: MorphoBluePartialTakeProfit
      stopLoss?: MorphoBlueStopLoss
      trailingStopLoss?: MorphoBlueTrailingStopLoss
    }
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    aaveStopLossToCollateral?: AaveStopLossToCollateral
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    aaveStopLossToCollateralDMA?: AaveStopLossToCollateralDMA
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    aaveStopLossToDebt?: AaveStopLossToDebt
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    aaveStopLossToDebtDMA?: AaveStopLossToDebtDMA
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    aaveBasicBuy?: DmaAaveBasicBuy
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    aaveBasicSell?: DmaAaveBasicSell
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    aaveTrailingStopLossDMA?: DmaAaveTrailingStopLoss
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    aavePartialTakeProfit?: DmaAavePartialTakeProfit
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    sparkStopLossToCollateral?: SparkStopLossToCollateral
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    sparkStopLossToCollateralDMA?: SparkStopLossToCollateralDMA
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    sparkStopLossToDebt?: SparkStopLossToDebt
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    sparkStopLossToDebtDMA?: SparkStopLossToDebtDMA
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    sparkBasicBuy?: DmaSparkBasicBuy
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    sparkBasicSell?: DmaSparkBasicSell
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    sparkTrailingStopLossDMA?: DmaSparkTrailingStopLoss
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    sparkPartialTakeProfit?: DmaSparkPartialTakeProfit
  }
  flags: {
    [ProtocolId.MAKER]: {
      isBasicBuyEnabled: boolean
      isBasicSellEnabled: boolean
      isStopLossEnabled: boolean
      isAutoTakeProfitEnabled: boolean
    }
    [ProtocolId.AAVE3]: {
      isBasicBuyEnabled: boolean
      isBasicSellEnabled: boolean
      isPartialTakeProfitEnabled: boolean
      isStopLossEnabled: boolean
      isTrailingStopLossEnabled: boolean
    }
    [ProtocolId.SPARK]: {
      isBasicBuyEnabled: boolean
      isBasicSellEnabled: boolean
      isPartialTakeProfitEnabled: boolean
      isStopLossEnabled: boolean
      isTrailingStopLossEnabled: boolean
    }
    [key: `${ProtocolId.MORPHO_BLUE}-0x${string}`]: {
      isBasicBuyEnabled: boolean
      isBasicSellEnabled: boolean
      isPartialTakeProfitEnabled: boolean
      isStopLossEnabled: boolean
      isTrailingStopLossEnabled: boolean
    }
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    isAaveStopLossEnabled: boolean
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    isSparkStopLossEnabled: boolean
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    isAaveBasicBuyEnabled: boolean
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    isAaveBasicSellEnabled: boolean
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    isSparkBasicBuyEnabled: boolean
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    isSparkBasicSellEnabled: boolean
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    isAavePartialTakeProfitEnabled: boolean
    /** @deprecated Use ProtocolId key, these will be removed in the future */
    isSparkPartialTakeProfitEnabled: boolean
  }
  triggerGroup: {
    aaveBasicBuy?: Trigger
    aaveBasicSell?: Trigger
    aavePartialTakeProfit?: Trigger
    aaveStopLoss?: Trigger
    sparkBasicBuy?: Trigger
    sparkBasicSell?: Trigger
    sparkPartialTakeProfit?: Trigger
    sparkStopLoss?: Trigger
    morphoBlueBasicBuy?: Trigger
    morphoBlueBasicSell?: Trigger
    morphoBluePartialTakeProfit?: Trigger
    morphoBlueStopLoss?: Trigger
    makerStopLoss?: Trigger
    makerBasicBuy?: Trigger
    makerBasicSell?: Trigger
    makerAutoTakeProfit?: Trigger
  }
  triggersCount: number
  additionalData?: Record<string, unknown>
}

export type AllDecodedParamsKeys =
  | keyof AaveStopLossToCollateral['decodedParams']
  | keyof AaveStopLossToDebt['decodedParams']
  | keyof DmaAaveBasicBuy['decodedParams']
  | keyof DmaAaveBasicSell['decodedParams']
  | keyof DmaAavePartialTakeProfit['decodedParams']
  | keyof DmaAavePartialTakeProfit['dynamicParams']
  | keyof DmaAaveTrailingStopLoss['decodedParams']
  | keyof DmaAaveTrailingStopLoss['dynamicParams']
  | keyof DmaSparkBasicBuy['decodedParams']
  | keyof DmaSparkBasicSell['decodedParams']
  | keyof DmaSparkPartialTakeProfit['decodedParams']
  | keyof DmaSparkPartialTakeProfit['dynamicParams']
  | keyof DmaSparkTrailingStopLoss['decodedParams']
  | keyof DmaSparkTrailingStopLoss['dynamicParams']
  | keyof SparkStopLossToCollateral['decodedParams']
  | keyof SparkStopLossToDebt['decodedParams']
  | keyof MorphoBlueBasicBuy['decodedParams']
  | keyof MorphoBlueBasicSell['decodedParams']
  | keyof MorphoBluePartialTakeProfit['decodedParams']
  | keyof MorphoBluePartialTakeProfit['dynamicParams']
  | keyof MorphoBlueTrailingStopLoss['decodedParams']
  | keyof MorphoBlueTrailingStopLoss['dynamicParams']
  | keyof MorphoBlueStopLoss['decodedParams']

export const getPropertyFromTriggerParams = ({
  trigger,
  property,
}: {
  trigger: Trigger
  property: AllDecodedParamsKeys
}): string | undefined => {
  const { decodedParams, dynamicParams } = trigger
  if (typeof decodedParams !== 'object' || decodedParams === null) {
    return undefined
  }
  if (property in decodedParams) {
    return (decodedParams as Record<string, string>)[property]
  }
  if (typeof dynamicParams !== 'object' || dynamicParams === null) {
    return undefined
  }
  if (property in dynamicParams) {
    return (dynamicParams as Record<string, string>)[property]
  }
  return undefined
}
