import { z } from 'zod'
import { PercentageDataSchema } from '../../../common/interfaces/IPercentage'
import { IPosition, PositionDataSchema } from '../../../common/interfaces/IPosition'
import { ILendingPool, LendingPoolDataSchema } from '../../../protocols'

/**
 * Parameters for an Earn Protocol simulation
 */
export interface IEarnProtocolParameters extends IEarnProtocolParametersData {
  /** Existing position to be refinanced */
  readonly sourcePosition: IPosition
  /** Target pool where the source position will be moved  */
  readonly targetFleet: ILendingPool
}

/**
 * Zod schema for the refinance parameters
 */
export const EarnProtocolParametersDataSchema = z.object({
  sourcePosition: PositionDataSchema,
  targetPool: LendingPoolDataSchema,
  slippage: PercentageDataSchema,
})

export type IEarnProtocolParametersData = Readonly<z.infer<typeof EarnProtocolParametersDataSchema>>

/**
 * Type guard for the Earn Protocol simulation parameters
 *
 * @param maybeEarnProtocolParameters Parameters to check
 *
 * @returns True if the parameters are valid
 */
export function isEarnProtocolParameters(
  maybeEarnProtocolParameters: unknown,
): maybeEarnProtocolParameters is IEarnProtocolParameters {
  return EarnProtocolParametersDataSchema.safeParse(maybeEarnProtocolParameters).success
}
