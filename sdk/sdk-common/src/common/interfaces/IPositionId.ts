import { z } from 'zod'

/**
 * @name IPositionIdData
 * @description Represents a unique identifier for a position in the Summer system
 */
export interface IPositionIdData {
  /* Unique identifier for the position inside the Summer.fi system */
  readonly id: string
}

/**
 * @name IPositionId
 * @description Interface for the implementors of the position id
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IPositionId extends IPositionIdData {
  readonly id: string
}

/**
 * @description Zod schema for IPositionId
 */
export const PositionIdSchema = z.object({
  id: z.string(),
})

/**
 * @description Type guard for IPositionId
 * @param maybePositionId
 * @returns true if the object is an IPositionId
 */
export function isPositionId(maybePositionId: unknown): maybePositionId is IPositionIdData {
  return PositionIdSchema.safeParse(maybePositionId).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IPositionIdData = {} as z.infer<typeof PositionIdSchema>
