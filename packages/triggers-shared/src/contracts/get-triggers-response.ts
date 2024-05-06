import { ProtocolId } from '@summerfi/serverless-shared'
import { Price, TokenBalance } from '../types'

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

export const MorphoBlueBasicBuyV2ID = 135n as const
export const MorphoBlueBasicSellV2ID = 136n as const
export const MorphoBluePartialTakeProfitID = 137n as const
export const MorphoBlueTrailingStopLossID = 10008n as const
export const MorphoBlueStopLossV2ID = 138n as const

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
    [ProtocolId.AAVE3]: {
      aaveStopLossToCollateral?: AaveStopLossToCollateral
      aaveStopLossToCollateralDMA?: AaveStopLossToCollateralDMA
      aaveStopLossToDebt?: AaveStopLossToDebt
      aaveStopLossToDebtDMA?: AaveStopLossToDebtDMA
      aaveBasicBuy?: DmaAaveBasicBuy
      aaveBasicSell?: DmaAaveBasicSell
      aaveTrailingStopLossDMA?: DmaAaveTrailingStopLoss
      aavePartialTakeProfit?: DmaAavePartialTakeProfit
    }
    [ProtocolId.SPARK]: {
      sparkStopLossToCollateral?: SparkStopLossToCollateral
      sparkStopLossToCollateralDMA?: SparkStopLossToCollateralDMA
      sparkStopLossToDebt?: SparkStopLossToDebt
      sparkStopLossToDebtDMA?: SparkStopLossToDebtDMA
      sparkBasicBuy?: DmaSparkBasicBuy
      sparkBasicSell?: DmaSparkBasicSell
      sparkTrailingStopLossDMA?: DmaSparkTrailingStopLoss
      sparkPartialTakeProfit?: DmaSparkPartialTakeProfit
    }
    [key: `${ProtocolId.MORPHO_BLUE}-0x${string}`]: {
      morphoBlueStopLoss?: MorphoBlueStopLoss
      morphoBlueBasicBuy?: MorphoBlueBasicBuy
      morphoBlueBasicSell?: MorphoBlueBasicSell
      morphoBlueTrailingStopLoss?: MorphoBlueTrailingStopLoss
      morphoBluePartialTakeProfit?: MorphoBluePartialTakeProfit
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
    isAaveBasicBuyEnabled: boolean
    isAaveBasicSellEnabled: boolean
    isAavePartialTakeProfitEnabled: boolean
    isAaveStopLossEnabled: boolean
    isSparkBasicBuyEnabled: boolean
    isSparkBasicSellEnabled: boolean
    isSparkPartialTakeProfitEnabled: boolean
    isSparkStopLossEnabled: boolean
    [key: `0x${string}`]: {
      isMorphoBlueBasicBuyEnabled: boolean
      isMorphoBlueBasicSellEnabled: boolean
      isMorphoBluePartialTakeProfitEnabled: boolean
      isMorphoBlueStopLossEnabled: boolean
    }
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
