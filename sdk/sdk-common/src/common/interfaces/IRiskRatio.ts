import { IPercentage, PercentageDataSchema } from './IPercentage'
import { IPrintable } from './IPrintable'
import { z } from 'zod'

/**
 * @name RiskRatioType
 * @description Enum for the different types of risk ratios supported
 */
export enum RiskRatioType {
  /** Loan-to-Value ratio in percentage */
  LTV = 'LTV',
  /** Inverse of LTV (Value-to-Loan) ratio in percentage*/
  CollateralizationRatio = 'CollateralizationRatio',
  /** Multiply factor */
  Multiple = 'Multiple',
}

/**
 * @name IRiskRatio
 * @description Interface for the implementors of the risk ratio
 */
export interface IRiskRatio extends IRiskRatioData, IPrintable {
  /** The type of the risk ratio */
  readonly type: RiskRatioType
  /** The risk ratio value, a percentage for LTV and Collateralization Ratio, a number for Multiple */
  readonly value: IPercentage | number

  /** Gets the LTV value as a collateralization ratio */
  toCollateralizationRatio(): IPercentage

  /** Gets the LTV value as a multiply factor */
  toMultiple(): number

  /** Gets the LTV value */
  toLTV(): IPercentage
}

/**
 * @description Zod schema for IRiskRatioData
 */
export const RiskRatioDataSchema = z.object({
  type: z.nativeEnum(RiskRatioType),
  value: PercentageDataSchema.or(z.number()),
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
