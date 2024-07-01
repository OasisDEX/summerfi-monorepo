import { IPositionId, PositionIdDataSchema } from '@summerfi/sdk-common/common'
import { z } from 'zod'

/**
 * @interface IMorphoBluePositionId
 * @description Represents the ID of a position in the Morpho protocol
 *
 * Currently empty as there are no specifics for this protocol
 */
export interface IMorphoBluePositionId extends IPositionId, IMorphoBluePositionIdData {
  // Empty on purpose
}

/**
 * @description Zod schema for IMorphoPositionId
 */
export const MorphoBluePositionIdDataSchema = z.object({
  ...PositionIdDataSchema.shape,
})

/**
 * Type for the data part of the IMorphoPositionId interface
 */
export type IMorphoBluePositionIdData = Readonly<z.infer<typeof MorphoBluePositionIdDataSchema>>

/**
 * @description Type guard for IMorphoPositionId
 * @param maybePositionId
 * @returns true if the object is an IMorphoPositionId
 */
export function isMorphoBluePositionId(
  maybePositionId: unknown,
): maybePositionId is IMorphoBluePositionId {
  return MorphoBluePositionIdDataSchema.safeParse(maybePositionId).success
}
