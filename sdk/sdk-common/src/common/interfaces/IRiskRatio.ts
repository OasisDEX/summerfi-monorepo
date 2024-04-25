import { IPercentage, IPercentageData, PercentageSchema } from './IPercentage'
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
 * @name IRiskRatioData
 * @description Represents a risk ratio with a certain type and percentage value
 *
 * The type indicates how to interpret the percentage value
 */
export interface IRiskRatioData {
  /** The type of the risk ratio */
  readonly type: RiskRatioType
  /** The percentage value */
  readonly ratio: IPercentageData
}

export interface IRiskRatio extends IRiskRatioData, IPrintable {
  readonly type: RiskRatioType
  readonly ratio: IPercentage

  /**
   * @name convertTo
   * @description Converts the risk ratio to a different type
   * @param type The type to convert to
   * @returns The converted risk ratio
   */
  convertTo(type: RiskRatioType): IRiskRatio
}

/**
 * @description Zod schema for IRiskRatioData
 */
export const RiskRatioSchema = z.object({
  type: z.nativeEnum(RiskRatioType),
  ratio: PercentageSchema,
})

/**
 * @description Type guard for IRiskRatioData
 * @param maybeRiskRatio
 * @returns true if the object is an IRiskRatioData
 */
export function isRiskRatio(maybeRiskRatio: unknown): maybeRiskRatio is IRiskRatioData {
  return RiskRatioSchema.safeParse(maybeRiskRatio).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IRiskRatioData = {} as z.infer<typeof RiskRatioSchema>
