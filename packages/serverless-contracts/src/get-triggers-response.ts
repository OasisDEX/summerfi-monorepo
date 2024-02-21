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

export const DmaAaveTrailingStopLoss = 10006n as const

export type Trigger = {
  triggerId: string
  triggerData: string
  triggerType: bigint
  decodedParams: unknown
  dynamicParams?: unknown
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

export type DmaAaveTrailingStopLoss = Trigger & {
  triggerTypeName: 'DmaAaveTrailingStopLoss'
  triggerType: typeof DmaAaveTrailingStopLoss
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

export type GetTriggersResponse = {
  triggers: {
    aaveStopLossToCollateral?: AaveStopLossToCollateral
    aaveStopLossToCollateralDMA?: AaveStopLossToCollateralDMA
    aaveStopLossToDebt?: AaveStopLossToDebt
    aaveStopLossToDebtDMA?: AaveStopLossToDebtDMA
    sparkStopLossToCollateral?: SparkStopLossToCollateral
    sparkStopLossToCollateralDMA?: SparkStopLossToCollateralDMA
    sparkStopLossToDebt?: SparkStopLossToDebt
    sparkStopLossToDebtDMA?: SparkStopLossToDebtDMA
    aaveBasicBuy?: DmaAaveBasicBuy
    aaveBasicSell?: DmaAaveBasicSell
    aaveTrailingStopLossDMA?: DmaAaveTrailingStopLoss
  }
  flags: {
    isAaveStopLossEnabled: boolean
    isSparkStopLossEnabled: boolean
    isAaveBasicBuyEnabled: boolean
    isAaveBasicSellEnabled: boolean
  }
  triggerGroup: {
    aaveStopLoss?: Trigger
    sparkStopLoss?: Trigger
    aaveBasicBuy?: Trigger
    aaveBasicSell?: Trigger
  }
  additionalData?: Record<string, unknown>
}

export type AllDecodedParamsKeys =
  | keyof AaveStopLossToCollateral['decodedParams']
  | keyof AaveStopLossToDebt['decodedParams']
  | keyof SparkStopLossToCollateral['decodedParams']
  | keyof SparkStopLossToDebt['decodedParams']
  | keyof DmaAaveBasicBuy['decodedParams']
  | keyof DmaAaveBasicSell['decodedParams']
  | keyof DmaAaveTrailingStopLoss['decodedParams']
  | keyof DmaAaveTrailingStopLoss['dynamicParams']

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
