import { PathParams, ValidationIssue, ValidationResults } from './types'
import { ZodIssue, ZodIssueCode } from 'zod'
import {
  eventBodyAaveBasicBuySchema,
  eventBodyAaveBasicSellSchema,
  eventBodyAavePartialTakeProfitSchema,
  eventBodyDmaAaveStopLossSchema,
  eventBodyDmaAaveTrailingStopLossSchema,
  eventBodyDmaSparkStopLossSchema,
  eventBodyDmaSparkTrailingStopLossSchema,
  eventBodySparkBasicBuySchema,
  eventBodySparkBasicSellSchema,
  eventBodySparkPartialTakeProfitSchema,
} from './validators'
import { SupportedTriggers } from '@summerfi/triggers-shared'
import { ChainId, ProtocolId } from '@summerfi/serverless-shared'

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

export const mergeValidationResults = (results: ValidationResults[]): ValidationResults => {
  return {
    success: results.every((result) => result.success),
    errors: results.flatMap((result) => result.errors),
    warnings: results.flatMap((result) => result.warnings),
  }
}

export type SupportedTriggersSchema =
  | typeof eventBodyAaveBasicBuySchema
  | typeof eventBodyAaveBasicSellSchema
  | typeof eventBodySparkBasicBuySchema
  | typeof eventBodySparkBasicSellSchema
  | typeof eventBodyDmaAaveStopLossSchema
  | typeof eventBodyDmaSparkStopLossSchema
  | typeof eventBodyDmaAaveTrailingStopLossSchema
  | typeof eventBodyDmaSparkTrailingStopLossSchema
  | typeof eventBodyAavePartialTakeProfitSchema
  | typeof eventBodySparkPartialTakeProfitSchema

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
    if (trigger === SupportedTriggers.DmaTrailingStopLoss) {
      return eventBodyDmaAaveTrailingStopLossSchema
    }
    if (trigger === SupportedTriggers.DmaPartialTakeProfit) {
      return eventBodyAavePartialTakeProfitSchema
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
    if (trigger === SupportedTriggers.DmaPartialTakeProfit) {
      return eventBodySparkPartialTakeProfitSchema
    }
  }

  return undefined
}
