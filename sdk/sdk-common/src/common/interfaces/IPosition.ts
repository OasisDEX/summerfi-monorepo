import { IPool, PoolSchema, isPool } from '../../protocols/interfaces/IPool'
import { PositionType } from '../enums/PositionType'
import { IPositionId, PositionIdSchema, isPositionId } from './IPositionId'
import { ITokenAmount, TokenAmountSchema, isTokenAmount } from './ITokenAmount'
import { z } from 'zod'

/**
 * @name IPosition
 * @description Represents a position in a pool/protocol for a single pair pool
 */
export interface IPosition {
  readonly type: PositionType
  readonly positionId: IPositionId
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
  readonly pool: IPool
}

/**
 * @description Type guard for IPosition
 * @param maybePosition
 * @returns true if the object is an IPosition
 */
export function isPosition(maybePosition: unknown): maybePosition is IPosition {
  return (
    typeof maybePosition === 'object' &&
    maybePosition !== null &&
    'type' in maybePosition &&
    'positionId' in maybePosition &&
    isPositionId(maybePosition.positionId) &&
    'debtAmount' in maybePosition &&
    isTokenAmount(maybePosition.debtAmount) &&
    'collateralAmount' in maybePosition &&
    isTokenAmount(maybePosition.collateralAmount) &&
    'pool' in maybePosition &&
    isPool(maybePosition.pool)
  )
}

/**
 * @description Zod schema for IPosition
 */
export const PositionSchema = z.object({
  type: z.nativeEnum(PositionType),
  positionId: PositionIdSchema,
  debtAmount: TokenAmountSchema,
  collateralAmount: TokenAmountSchema,
  pool: PoolSchema,
})

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IPosition = {} as z.infer<typeof PositionSchema>
