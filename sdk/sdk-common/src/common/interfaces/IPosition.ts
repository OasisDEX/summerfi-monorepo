import { z } from 'zod'
import { PositionType } from '../types/PositionType'
import { IPool, isPool } from './IPool'
import { IPositionId, isPositionId } from './IPositionId'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @name IPosition
 * @description Represents a Summer position in a pool/protocol
 */
export interface IPosition extends IPositionData {
  /** Signature to differentiate from similar interfaces */
  readonly [__signature__]: symbol
  /** Type of the position in the Summer.fi system */
  readonly type: PositionType
  /** Unique identifier for the position inside the Summer.fi system */
  readonly id: IPositionId
  /** Pool where the position is opened */
  readonly pool: IPool
}

/**
 * @description Zod schema for IPosition
 */
export const PositionDataSchema = z.object({
  type: z.nativeEnum(PositionType),
  id: z.custom<IPositionId>((val) => isPositionId(val)),
  pool: z.custom<IPool>((val) => isPool(val)),
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
