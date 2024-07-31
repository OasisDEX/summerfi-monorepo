import { z } from 'zod'
import { PositionType, PositionTypeSchema } from '../types'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __ipositionid__: unique symbol = Symbol()

/**
 * @name IPositionId
 * @description Represents a unique identifier for a position in the Summer system
 */
export interface IPositionId extends IPositionIdData {
  /** Signature to differentiate from similar interfaces */
  readonly [__ipositionid__]: 'IPositionId'
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
 * Type for the parameters of the IPosition interface
 */
export type IPositionIdParameters = Omit<IPositionIdData, ''>

/**
 * @description Type guard for IPositionId
 * @param maybePositionId
 * @returns true if the object is an IPositionId
 */
export function isPositionId(maybePositionId: unknown): maybePositionId is IPositionId {
  return PositionIdDataSchema.safeParse(maybePositionId).success
}
