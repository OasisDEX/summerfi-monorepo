import { IPool, IPoolData, PoolSchema } from '../../protocols/interfaces/IPool'
import { PositionType } from '../enums/PositionType'
import { IPositionId, IPositionIdData, PositionIdSchema } from './IPositionId'
import { ITokenAmount, ITokenAmountData, TokenAmountSchema } from './ITokenAmount'
import { z } from 'zod'

/**
 * @name IPositionData
 * @description Represents a Summer position in a pool/protocol
 */
export interface IPositionData {
  /** Type of the position in the Summer.fi system */
  readonly type: PositionType
  /** Unique identifier for the position inside the Summer.fi system */
  readonly id: IPositionIdData
  /** Amount of debt borrowed from the pool */
  readonly debtAmount: ITokenAmountData
  /** Amount of collateral deposited in the pool */
  readonly collateralAmount: ITokenAmountData
  /** Pool where the position is */
  readonly pool: IPoolData
}

/**
 * @name IPosition
 * @description Interface for the implementors of the position
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IPosition extends IPositionData {
  readonly type: PositionType
  readonly id: IPositionId
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
  readonly pool: IPool
}

/**
 * @description Zod schema for IPosition
 */
export const PositionSchema = z.object({
  type: z.nativeEnum(PositionType),
  id: PositionIdSchema,
  debtAmount: TokenAmountSchema,
  collateralAmount: TokenAmountSchema,
  pool: PoolSchema,
})

/**
 * @description Type guard for IPosition
 * @param maybePosition
 * @returns true if the object is an IPosition
 */
export function isPosition(maybePosition: unknown): maybePosition is IPositionData {
  return PositionSchema.safeParse(maybePosition).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IPositionData = {} as z.infer<typeof PositionSchema>
