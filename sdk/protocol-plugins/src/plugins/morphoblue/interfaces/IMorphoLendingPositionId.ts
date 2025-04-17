import { ILendingPositionId, LendingPositionIdDataSchema } from '@summerfi/sdk-common'
import { z } from 'zod'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IMorphoLendingPositionId
 * @description Represents the ID of a lending position in the Morpho protocol
 *
 * Currently empty as there are no specifics for this protocol
 */
export interface IMorphoLendingPositionId extends ILendingPositionId, IMorphoLendingPositionIdData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
}

/**
 * @description Zod schema for IMorphoLendingPositionId
 */
export const MorphoLendingPositionIdDataSchema = z.object({
  ...LendingPositionIdDataSchema.shape,
})

/**
 * Type for the data part of the IMorphoLendingPositionId interface
 */
export type IMorphoLendingPositionIdData = Readonly<
  z.infer<typeof MorphoLendingPositionIdDataSchema>
>

/**
 * @description Type guard for IMorphoLendingPositionId
 * @param maybeMorphoLendingPositionId
 * @returns true if the object is an IMorphoLendingPositionId
 */
export function isMorphoLendingPositionId(
  maybeMorphoLendingPositionId: unknown,
): maybeMorphoLendingPositionId is IMorphoLendingPositionId {
  return MorphoLendingPositionIdDataSchema.safeParse(maybeMorphoLendingPositionId).success
}
