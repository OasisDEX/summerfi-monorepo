import { z } from 'zod'
import { PositionType, PositionTypeSchema } from '../types'

/**
 * @name IPositionId
 * @description Represents a unique identifier for a position in the Summer system
 */
export interface IPositionId extends IPositionIdData {
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
 * Type for PositionData interface
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
