import { z } from 'zod'
import { IPosition, PositionDataSchema } from '../../common/interfaces/IPosition'
import { ITokenAmount, isTokenAmount } from '../../common/interfaces/ITokenAmount'
import { PositionType } from '../../common/types/PositionType'
import { LendingPositionType, LendingPositionTypeSchema } from '../types'
import { ILendingPool, isLendingPool } from './ILendingPool'
import { ILendingPositionId, isLendingPositionId } from './ILendingPositionId'

/**
 * @name ILendingPosition
 * @description Represents a position in a Lending protocol
 */
export interface ILendingPosition extends IPosition {
  /** Signature to differentiate from similar interfaces */
  readonly _signature_1: 'ILendingPosition'
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
  ...PositionDataSchema.shape,
  type: z.custom<PositionType>((val) => val === PositionType.Lending),
  subtype: LendingPositionTypeSchema,
  id: z.custom<ILendingPositionId>((val) => isLendingPositionId(val)),
  debtAmount: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  collateralAmount: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  pool: z.custom<ILendingPool>((val) => isLendingPool(val)),
})

/**
 * Type for the data part of the ILendingPosition interface
 */
export type ILendingPositionData = Readonly<z.infer<typeof LendingPositionDataSchema>>

/**
 * Type for the parameters of the ILendingPosition interface
 */
export type ILendingPositionParameters = Omit<ILendingPositionData, 'type'>

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
