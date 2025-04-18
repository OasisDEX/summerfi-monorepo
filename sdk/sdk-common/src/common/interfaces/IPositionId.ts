import { z } from 'zod'
import { PositionType, PositionTypeSchema } from '../enums/PositionType'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @name IPositionId
 * @description Represents a unique identifier for a position in the Summer system
 */
export interface IPositionId extends IPositionIdData {
  /** Signature to differentiate from similar interfaces */
  readonly [__signature__]: symbol
  /* Unique identifier for the position inside the Summer.fi system */
  readonly id: string
  /** Type of the position */
  readonly type: PositionType
}

/**
 * @description Zod schema for IPositionId
 */
export const PositionIdDataSchema = z.object({
  id: z.string(),
  type: PositionTypeSchema,
})

/**
 * Type for IPositionData interface
 */
export type IPositionIdData = Readonly<z.infer<typeof PositionIdDataSchema>>

/**
 * @description Type guard for IPositionId
 * @param maybePositionId
 * @returns true if the object is an IPositionId
 */
export function isPositionId(maybePositionId: unknown): maybePositionId is IPositionId {
  return PositionIdDataSchema.safeParse(maybePositionId).success
}
