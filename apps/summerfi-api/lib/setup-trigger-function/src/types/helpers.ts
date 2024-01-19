import {
  AaveAutoBuyTriggerData,
  AaveAutoSellTriggerData,
  TriggerData,
  ValidationIssue,
  ValidationResults,
} from './types'
import { ZodIssueCode } from 'zod'
import { ZodIssue } from 'zod'

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
    success: false,
    errors: (errors ?? []).map(zodIssueToIssue),
    warnings: (warnings ?? []).map(zodIssueToIssue),
  }
}
