import { IPercentage, PercentageDataSchema } from './IPercentage'
import { IPrintable } from './IPrintable'
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
 * @description Interface for the implementors of the risk ratio
 */
export interface IRiskRatio extends IRiskRatioData, IPrintable {
  /** The type of the risk ratio */
  readonly type: RiskRatioType
  /** The percentage value */
  readonly ratio: IPercentage
}

/**
 * @description Zod schema for IRiskRatioData
 */
export const RiskRatioDataSchema = z.object({
  type: z.nativeEnum(RiskRatioType),
  ratio: PercentageDataSchema,
})

/**
 * Type for the data part of the IRiskRatio interface
 */
export type IRiskRatioData = Readonly<z.infer<typeof RiskRatioDataSchema>>

/**
 * @description Type guard for IRiskRatio
 * @param maybeRiskRatio
 * @returns true if the object is an IRiskRatio
 */
export function isRiskRatio(maybeRiskRatio: unknown): maybeRiskRatio is IRiskRatio {
  return RiskRatioDataSchema.safeParse(maybeRiskRatio).success
}
