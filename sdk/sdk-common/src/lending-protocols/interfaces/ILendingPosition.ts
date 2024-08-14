import { z } from 'zod'
import { IPosition, PositionDataSchema } from '../../common/interfaces/IPosition'
import { ITokenAmount, isTokenAmount } from '../../common/interfaces/ITokenAmount'
import { PositionType } from '../../common/types/PositionType'
import { LendingPositionType } from '../types/LendingPositionType'
import { ILendingPool, isLendingPool } from './ILendingPool'
import { ILendingPositionId, isLendingPositionId } from './ILendingPositionId'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @name ILendingPosition
 * @description Represents a position in a Lending protocol
 */
export interface ILendingPosition extends IPosition, ILendingPositionData {
  /** Signature to differentiate from similar interfaces */
  readonly [__signature__]: symbol
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

  // Re-declaring the properties to narrow the types
  readonly type: PositionType.Lending
}

/**
 * @description Zod schema for ILendingPosition
 */
export const LendingPositionDataSchema = z.object({
  ...PositionDataSchema.shape,
  subtype: z.nativeEnum(LendingPositionType),
  id: z.custom<ILendingPositionId>((val) => isLendingPositionId(val)),
  debtAmount: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  collateralAmount: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  pool: z.custom<ILendingPool>((val) => isLendingPool(val)),
  type: z.literal(PositionType.Lending),
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
