import { z } from 'zod'
import { PositionType } from '../types/PositionType'
import { IPool, isPool } from './IPool'
import { IPositionId, isPositionId } from './IPositionId'
import { ITokenAmount, isTokenAmount } from './ITokenAmount'

/**
 * @name IPosition
 * @description Represents a Summer position in a pool/protocol
 */
export interface IPosition extends IPositionData {
  /** Signature to differentiate from similar interfaces */
  readonly _signature_0: 'IPosition'
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
  id: z.custom<IPositionId>((val) => isPositionId(val)),
  debtAmount: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  collateralAmount: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  pool: z.custom<IPool>((val) => isPool(val)),
})

/**
 * Type for the data part of the IPosition interface
 */
export type IPositionData = Readonly<z.infer<typeof PositionDataSchema>>

/**
 * Type for the parameters of the IPosition interface
 */
export type IPositionParameters = Omit<IPositionData, ''>

/**
 * @description Type guard for IPosition
 * @param maybePosition
 * @returns true if the object is an IPosition
 */
export function isPosition(maybePosition: unknown): maybePosition is IPosition {
  return PositionDataSchema.safeParse(maybePosition).success
}
