export const AaveStopLossToCollateralV2ID = 111n as const
export const AaveStopLossToDebtV2ID = 112n as const
export const SparkStopLossToCollateralV2ID = 117n as const
export const SparkStopLossToDebtV2ID = 118n as const
export const DmaAaveBasicBuyV2 = 121n as const
export const DmaAaveBasicSellV2 = 122n as const
export const DmaAaveStopLossToCollateralV2 = 123n as const
export const DmaAaveStopLossToDebtV2 = 124n as const
export const DmaSparkStopLossToCollateralV2 = 125n as const
export const DmaSparkStopLossToDebtV2 = 126n as const

export type AaveStopLossToCollateral = {
  triggerTypeName: 'AaveStopLossToCollateralV2'
  triggerType: typeof AaveStopLossToCollateralV2ID
  triggerId: string
  triggerData: string
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    ltv: string
  }
}

export type AaveStopLossToDebt = {
  triggerTypeName: 'AaveStopLossToDebtV2'
  triggerType: typeof AaveStopLossToDebtV2ID
  triggerId: string
  triggerData: string
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    ltv: string
  }
}

export type SparkStopLossToCollateral = {
  triggerTypeName: 'SparkStopLossToCollateralV2'
  triggerType: typeof SparkStopLossToCollateralV2ID
  triggerId: string
  triggerData: string
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    ltv: string
  }
}

export type SparkStopLossToDebt = {
  triggerTypeName: 'SparkStopLossToDebtV2'
  triggerType: typeof SparkStopLossToDebtV2ID
  triggerId: string
  triggerData: string
  decodedParams: {
    positionAddress: string
    triggerType: string
    maxCoverage: string
    debtToken: string
    collateralToken: string
    ltv: string
  }
}

export type DmaAaveBasicBuy = {
  triggerTypeName: 'DmaAaveBasicBuyV2'
  triggerType: typeof DmaAaveBasicBuyV2
  triggerId: string
  triggerData: string
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

export type DmaAaveBasicSell = {
  triggerTypeName: 'DmaAaveBasicSellV2'
  triggerType: typeof DmaAaveBasicSellV2
  triggerId: string
  triggerData: string
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

export type GetTriggersResponse = {
  triggers: {
    aaveStopLossToCollateral?: AaveStopLossToCollateral
    aaveStopLossToDebt?: AaveStopLossToDebt
    sparkStopLossToCollateral?: SparkStopLossToCollateral
    sparkStopLossToDebt?: SparkStopLossToDebt
    aaveBasicBuy?: DmaAaveBasicBuy
    aaveBasicSell?: DmaAaveBasicSell
  }
  additionalData?: Record<string, unknown>
}
