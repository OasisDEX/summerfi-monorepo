import { IPercentage, PercentageSchema, isPercentage } from './IPercentage'
import { z } from 'zod'

/**
 * @name RiskRatioType
 * @description Enum for the different types of risk ratios supported
 */
export enum RiskRatioType {
  /** Loan-to-Value ratio */
  LTV = 'LTV',
  /** TODO */
  CollateralizationRatio = 'CollateralizationRatio',
  /** TODO */
  Multiple = 'Multiple',
}

/**
 * @name IRiskRatio
 * @description Represents a risk ratio with a certain type and percentage value
 *
 * The type indicates how to interpret the percentage value
 */
export interface IRiskRatio {
  /** The type of the risk ratio */
  type: RiskRatioType
  /** The percentage value */
  ratio: IPercentage
}

export function isRiskRatio(maybeRiskRatio: unknown): maybeRiskRatio is IRiskRatio {
  return (
    typeof maybeRiskRatio === 'object' &&
    maybeRiskRatio !== null &&
    'type' in maybeRiskRatio &&
    'ratio' in maybeRiskRatio &&
    isPercentage(maybeRiskRatio.ratio)
  )
}

export const RiskRatioSchema = z.object({
  type: z.nativeEnum(RiskRatioType),
  ratio: PercentageSchema,
})

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IRiskRatio = {} as z.infer<typeof RiskRatioSchema>
