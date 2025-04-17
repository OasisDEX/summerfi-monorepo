import {
  ILendingPosition,
  LendingPositionDataSchema,
  LendingPositionType,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { IMorphoLendingPool, isMorphoLendingPool } from './IMorphoLendingPool'
import { IMorphoLendingPositionId, isMorphoLendingPositionId } from './IMorphoLendingPositionId'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IMorphoLendingPosition
 * @description Represents a lending position in the Morpho protocol
 *
 * Currently empty as there are no specifics for this protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoLendingPosition extends ILendingPosition, IMorphoLendingPositionData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** The position's ID */
  readonly id: IMorphoLendingPositionId
  /** The pool the position belongs to */
  readonly pool: IMorphoLendingPool

  // Re-declaring the properties to narrow the types
  readonly subtype: LendingPositionType
}

/**
 * @description Zod schema for IMorphoPositionId
 */
export const MorphoLendingPositionDataSchema = z.object({
  ...LendingPositionDataSchema.shape,
  id: z.custom<IMorphoLendingPositionId>((val) => isMorphoLendingPositionId(val)),
  pool: z.custom<IMorphoLendingPool>((val) => isMorphoLendingPool(val)),
})

/**
 * Type for the data part of the IMorphoPosition interface
 */
export type IMorphoLendingPositionData = Readonly<z.infer<typeof MorphoLendingPositionDataSchema>>

/**
 * @description Type guard for IMorphoPosition
 * @param maybePosition
 * @returns true if the object is an IMorphoPosition
 */
export function isMorphoLendingPosition(
  maybePosition: unknown,
): maybePosition is IMorphoLendingPosition {
  return MorphoLendingPositionDataSchema.safeParse(maybePosition).success
}
