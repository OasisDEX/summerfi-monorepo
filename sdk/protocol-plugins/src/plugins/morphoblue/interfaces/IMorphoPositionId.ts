import { IPositionId, PositionIdDataSchema } from '@summerfi/sdk-common/common'
import { z } from 'zod'

/**
 * @interface IMorphoPositionId
 * @description Represents the ID of a position in the Morpho protocol
 *
 * Currently empty as there are no specifics for this protocol
 */
export interface IMorphoPositionId extends IPositionId, IMorphoPositionIdData {
  // Empty on purpose
}

/**
 * @description Zod schema for IMorphoPositionId
 */
export const MorphoPositionIdDataSchema = z.object({
  ...PositionIdDataSchema.shape,
})

/**
 * Type for the data part of the IMorphoPositionId interface
 */
export type IMorphoPositionIdData = Readonly<z.infer<typeof MorphoPositionIdDataSchema>>

/**
 * @description Type guard for IMorphoPositionId
 * @param maybePositionId
 * @returns true if the object is an IMorphoPositionId
 */
export function isMorphoPositionId(maybePositionId: unknown): maybePositionId is IMorphoPositionId {
  return MorphoPositionIdDataSchema.safeParse(maybePositionId).success
}
