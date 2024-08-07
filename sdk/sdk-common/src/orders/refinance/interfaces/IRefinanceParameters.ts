import { z } from 'zod'
import { IPercentage, isPercentage } from '../../../common/interfaces/IPercentage'
import { ILendingPool, isLendingPool } from '../../../lending-protocols/interfaces/ILendingPool'
import {
  ILendingPosition,
  isLendingPosition,
} from '../../../lending-protocols/interfaces/ILendingPosition'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * Parameters for a refinance simulation
 */
export interface IRefinanceParameters extends IRefinanceParametersData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** Existing position to be refinanced */
  readonly sourcePosition: ILendingPosition
  /** Target pool where the source position will be moved  */
  readonly targetPool: ILendingPool
  /** Maximum slippage allowed for the simulation */
  readonly slippage: IPercentage
}

/**
 * Zod schema for the refinance parameters
 */
export const RefinanceParametersDataSchema = z.object({
  sourcePosition: z.custom<ILendingPosition>((val) => isLendingPosition(val)),
  targetPool: z.custom<ILendingPool>((val) => isLendingPool(val)),
  slippage: z.custom<IPercentage>((val) => isPercentage(val)),
})

/**
 * Type for the data part of the refinance parameters
 */
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
