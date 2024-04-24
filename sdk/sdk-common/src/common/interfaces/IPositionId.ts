import { z } from 'zod'

/**
 * @name IPositionId
 * @description Represents a unique identifier for a position in the Summer system
 */
export interface IPositionId {
  /* Unique identifier for the position inside the Summer.fi system */
  readonly id: string
}

/**
 * @description Type guard for IPositionId
 * @param maybePositionId
 * @returns true if the object is an IPositionId
 */
export function isPositionId(maybePositionId: unknown): maybePositionId is IPositionId {
  return typeof maybePositionId === 'object' && maybePositionId !== null && 'id' in maybePositionId
}

/**
 * @description Zod schema for IPositionId
 */
export const PositionIdSchema = z.object({
  id: z.string(),
})

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IPositionId = {} as z.infer<typeof PositionIdSchema>
