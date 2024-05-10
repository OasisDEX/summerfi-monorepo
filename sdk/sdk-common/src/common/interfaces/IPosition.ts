import { IPool, PoolDataSchema } from '../../protocols/interfaces/IPool'
import { PositionType } from '../enums/PositionType'
import { IPositionId, PositionIdDataSchema } from './IPositionId'
import { ITokenAmount, TokenAmountDataSchema } from './ITokenAmount'
import { z } from 'zod'

/**
 * @name IPosition
 * @description Represents a Summer position in a pool/protocol
 */
export interface IPosition extends IPositionData {
  /** Type of the position in the Summer.fi system */
  readonly type: PositionType
  /** Unique identifier for the position inside the Summer.fi system */
  readonly id: IPositionId
  /** Amount of debt borrowed from the pool */
  readonly debtAmount: ITokenAmount
  /** Amount of collateral deposited in the pool */
  readonly collateralAmount: ITokenAmount
  /** Pool where the position is */
  readonly pool: IPool
}

/**
 * @description Zod schema for IPosition
 */
export const PositionDataSchema = z.object({
  type: z.nativeEnum(PositionType),
  id: PositionIdDataSchema,
  debtAmount: TokenAmountDataSchema,
  collateralAmount: TokenAmountDataSchema,
  pool: PoolDataSchema,
})

/**
 * Type for the data part of the IPosition interface
 */
export type IPositionData = Readonly<z.infer<typeof PositionDataSchema>>

/**
 * @description Type guard for IPosition
 * @param maybePosition
 * @returns true if the object is an IPosition
 */
export function isPosition(maybePosition: unknown): maybePosition is IPosition {
  return PositionDataSchema.safeParse(maybePosition).success
}
