import { z } from 'zod'

/**
 * @name IPositionId
 * @description Represents a unique identifier for a position in the Summer system
 */
export interface IPositionId extends IPositionIdData {
  /* Unique identifier for the position inside the Summer.fi system */
  readonly id: string
}

/**
 * @description Zod schema for IPositionId
 */
export const PositionIdDataSchema = z.object({
  id: z.string(),
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
