import {
  AaveAutoBuyTriggerData,
  AaveAutoSellTriggerData,
  PathParams,
  TriggerData,
  ValidationIssue,
  ValidationResults,
} from './types'
import { ZodIssue, ZodIssueCode } from 'zod'
import {
  eventBodyAaveBasicBuySchema,
  eventBodyAaveBasicSellSchema,
  eventBodyDmaAaveStopLossSchema,
  eventBodyDmaAaveTrailingStopLossSchema,
  eventBodyDmaSparkStopLossSchema,
  eventBodyDmaSparkTrailingStopLossSchema,
  eventBodySparkBasicBuySchema,
  eventBodySparkBasicSellSchema,
  SupportedTriggers,
} from './validators'
import { ChainId, ProtocolId } from '@summerfi/serverless-shared'

export const isAaveAutoBuyTriggerData = (
  triggerData: TriggerData,
): triggerData is AaveAutoBuyTriggerData => {
  return 'maxBuyPrice' in triggerData
}

export const isAaveAutoSellTriggerData = (
  triggerData: TriggerData,
): triggerData is AaveAutoSellTriggerData => {
  return 'minSellPrice' in triggerData
}

const zodIssueToIssue = (issue: ZodIssue): ValidationIssue => {
  return {
    message: issue.message,
    code: issue.code === ZodIssueCode.custom ? issue.params?.code : issue.code,
    path: issue.path,
  }
}

export const mapZodResultToValidationResults = ({
  errors,
  warnings,
}: {
  errors?: ZodIssue[]
  warnings?: ZodIssue[]
}): ValidationResults => {
  return {
    success: (errors ?? []).length === 0,
    errors: (errors ?? []).map(zodIssueToIssue),
    warnings: (warnings ?? []).map(zodIssueToIssue),
  }
}

export type SupportedTriggersSchema =
  | typeof eventBodyAaveBasicBuySchema
  | typeof eventBodyAaveBasicSellSchema
  | typeof eventBodyDmaAaveStopLossSchema
  | typeof eventBodyDmaSparkStopLossSchema
  | typeof eventBodyDmaAaveTrailingStopLossSchema

export const getBodySchema = (pathParams: PathParams): SupportedTriggersSchema | undefined => {
  const { trigger, chainId, protocol } = pathParams
  if (protocol === ProtocolId.AAVE3) {
    if (trigger === SupportedTriggers.AutoBuy) {
      return eventBodyAaveBasicBuySchema
    }
    if (trigger === SupportedTriggers.AutoSell) {
      return eventBodyAaveBasicSellSchema
    }
    if (trigger === SupportedTriggers.DmaStopLoss) {
      return eventBodyDmaAaveStopLossSchema
    }
    if (trigger == SupportedTriggers.DmaTrailingStopLoss) {
      return eventBodyDmaAaveTrailingStopLossSchema
    }
  }
  if (protocol === ProtocolId.SPARK && chainId === ChainId.MAINNET) {
    if (trigger === SupportedTriggers.DmaStopLoss) {
      return eventBodyDmaSparkStopLossSchema
    }
    if (trigger === SupportedTriggers.DmaTrailingStopLoss) {
      return eventBodyDmaSparkTrailingStopLossSchema
    }
    if (trigger === SupportedTriggers.AutoBuy) {
      return eventBodySparkBasicBuySchema
    }
    if (trigger === SupportedTriggers.AutoSell) {
      return eventBodySparkBasicSellSchema
    }
  }

  return undefined
}
