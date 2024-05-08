import { IPositionId, IPositionIdData, PositionIdSchema } from '@summerfi/sdk-common/common'
import { z } from 'zod'

/**
 * @interface IMorphoPositionIdData
 * @description Represents the ID of a position in the Morpho protocol
 *
 * Currently empty as there are no specifics for this protocol
 */
export interface IMorphoPositionIdData extends IPositionIdData {
  // Empty on purpose
}

/**
 * @interface IMorphoPositionId
 * @description Interface for the implementors of the position id
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IMorphoPositionId extends IPositionId, IMorphoPositionIdData {
  // Empty on purpose
}

/**
 * @description Zod schema for IMorphoPositionId
 */
export const MorphoPositionIdSchema = z.object({
  ...PositionIdSchema.shape,
})

/**
 * @description Type guard for IMorphoPositionId
 * @param maybePositionId
 * @returns true if the object is an IMorphoPositionId
 */
export function isMorphoPositionId(
  maybePositionId: unknown,
): maybePositionId is IMorphoPositionIdData {
  return MorphoPositionIdSchema.safeParse(maybePositionId).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IMorphoPositionIdData = {} as z.infer<typeof MorphoPositionIdSchema>
