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
  eventBodyDmaSparkStopLossSchema,
} from './validators'
import { ChainId, ProtocolId } from '@summerfi/serverless-shared/'
import { SupportedTriggers } from './validators'

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

export const isAaveStopLossTriggerData = (
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

export const isBigInt = (value: string) => {
  try {
    BigInt(value)
    return true
  } catch (error) {
    if (error instanceof SyntaxError) {
      return false
    }
    throw error
  }
}

export const safeParseBigInt = (value: string) => {
  if (isBigInt(value)) {
    return BigInt(value)
  }
  return undefined
}

export type SupportedTriggersSchema =
  | typeof eventBodyAaveBasicBuySchema
  | typeof eventBodyAaveBasicSellSchema
  | typeof eventBodyDmaAaveStopLossSchema
  | typeof eventBodyDmaSparkStopLossSchema

export const getBodySchema = (pathParams: PathParams): SupportedTriggersSchema => {
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
  }
  if (protocol === ProtocolId.SPARK && chainId === ChainId.MAINNET) {
    if (trigger === SupportedTriggers.DmaStopLoss) {
      return eventBodyDmaSparkStopLossSchema
    }
  }

  throw new Error(`Unsupported trigger: ${trigger} on protocol: ${protocol} and chain: ${chainId}`)
}
