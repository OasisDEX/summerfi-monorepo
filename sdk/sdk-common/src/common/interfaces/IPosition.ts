import { z } from 'zod'
import { PositionType } from '../types/PositionType'
import { IPositionId, isPositionId } from './IPositionId'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
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
}

/**
 * @description Zod schema for IPosition
 */
export const PositionDataSchema = z.object({
  type: z.nativeEnum(PositionType),
  id: z.custom<IPositionId>((val) => isPositionId(val)),
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
