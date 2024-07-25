import { z } from 'zod'
import { IPosition } from '../../common/interfaces/IPosition'
import { ITokenAmount, TokenAmountDataSchema } from '../../common/interfaces/ITokenAmount'
import { PositionType } from '../../common/types/PositionType'
import { LendingPositionType, LendingPositionTypeSchema } from '../types'
import { ILendingPool, LendingPoolDataSchema } from './ILendingPool'
import { ILendingPositionId, LendingPositionIdDataSchema } from './ILendingPositionId'

/**
 * @name ILendingPosition
 * @description Represents a position in a Lending protocol
 */
export interface ILendingPosition extends IPosition {
  /** Type of the position */
  readonly type: PositionType.Lending
  /** Subtype of the position in the Summer.fi system */
  readonly subtype: LendingPositionType
  /** Unique identifier for the position inside the Summer.fi system */
  readonly id: ILendingPositionId
  /** Amount of debt borrowed from the pool */
  readonly debtAmount: ITokenAmount
  /** Amount of collateral deposited in the pool */
  readonly collateralAmount: ITokenAmount
  /** Pool where the position is */
  readonly pool: ILendingPool
}

/**
 * @description Zod schema for ILendingPosition
 */
export const LendingPositionDataSchema = z.object({
  type: z.literal(PositionType.Lending),
  subtype: LendingPositionTypeSchema,
  id: LendingPositionIdDataSchema,
  debtAmount: TokenAmountDataSchema,
  collateralAmount: TokenAmountDataSchema,
  pool: LendingPoolDataSchema,
})

/**
 * Type for the data part of the ILendingPosition interface
 */
export type ILendingPositionData = Readonly<z.infer<typeof LendingPositionDataSchema>>

/**
 * @description Type guard for ILendingPosition
 * @param maybeLendingPosition Object to be checked
 * @returns true if the object is an ILendingPosition
 *
 * It also asserts the type so that TypeScript knows that the object is an ILendingPool
 */
export function isLendingPosition(
  maybeLendingPosition: unknown,
): maybeLendingPosition is ILendingPosition {
  return LendingPositionDataSchema.safeParse(maybeLendingPosition).success
}
