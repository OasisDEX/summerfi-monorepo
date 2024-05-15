import { z } from 'zod'
import { IPercentage, PercentageDataSchema } from '../../../common/interfaces/IPercentage'
import { IPosition, PositionDataSchema } from '../../../common/interfaces/IPosition'
import { ILendingPool, LendingPoolDataSchema } from '../../../protocols'

/**
 * Parameters for a refinance simulation
 */
export interface IRefinanceParameters extends IRefinanceParametersData {
  /** Existing position to be refinanced */
  readonly sourcePosition: IPosition
  /** Target pool where the source position will be moved  */
  readonly targetPool: ILendingPool
  /** Maximum slippage allowed for the simulation */
  readonly slippage: IPercentage
}

/**
 * Zod schema for the refinance parameters
 */
export const RefinanceParametersDataSchema = z.object({
  sourcePosition: PositionDataSchema,
  targetPool: LendingPoolDataSchema,
  slippage: PercentageDataSchema,
})

export type IRefinanceParametersData = Readonly<z.infer<typeof RefinanceParametersDataSchema>>

/**
 * Type guard for the refinance parameters
 * @param maybeRefinanceParameters Parameters to check
 * @returns True if the parameters are valid
 */
export function isRefinanceParameters(
  maybeRefinanceParameters: unknown,
): maybeRefinanceParameters is IRefinanceParameters {
  return RefinanceParametersDataSchema.safeParse(maybeRefinanceParameters).success
}
